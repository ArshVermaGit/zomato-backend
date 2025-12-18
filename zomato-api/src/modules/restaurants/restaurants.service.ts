import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { S3Service } from '../../common/services/s3.service';
import { GeocodingService } from '../../common/services/geocoding.service';
import {
    CreateRestaurantDto,
    UpdateRestaurantDto,
    RestaurantFilterDto,
    NearbyRestaurantDto,
    UpdateMenuItemDto,
    SearchRestaurantDto
} from './dto/restaurant.dto';
import { Prisma } from '@prisma/client';

import { SearchService } from '../search/search.service';

@Injectable()
export class RestaurantsService {
    constructor(
        private prisma: PrismaService,
        private realtimeGateway: RealtimeGateway,
        private s3Service: S3Service,
        private geocodingService: GeocodingService,
        private searchService: SearchService,
    ) { }

    // ============= CREATE RESTAURANT =============
    async createRestaurant(partnerId: string, dto: CreateRestaurantDto) {
        // 1. Validate and geocode address
        const locationInput = dto.location;
        let location = locationInput;

        // If location is a string (address), geocode it
        if (typeof locationInput === 'string') {
            const geocoded = await this.geocodingService.getCoordinates(locationInput);
            if (!geocoded) {
                throw new BadRequestException('Invalid address');
            }
            location = {
                lat: geocoded.lat,
                lng: geocoded.lng,
                address: locationInput,
            };
        } else if (locationInput && (!locationInput.lat || !locationInput.lng)) {
            // Try to geocode if address is present in object
            if (locationInput.address) {
                const geocoded = await this.geocodingService.getCoordinates(locationInput.address);
                if (geocoded) {
                    location = { ...locationInput, lat: geocoded.lat, lng: geocoded.lng };
                }
            }
        }

        // 2. Upload images to S3
        const uploadedImages: string[] = [];
        // safely access images from dto (as any since it might not be in DTO definition)
        const dtoImages = (dto as any).images;

        if (dtoImages && dtoImages.length > 0) {
            for (const image of dtoImages) {
                // Assuming image is a file buffer or similar, or a wrapper.
                // If it's a raw file object from Multer:
                const content = image.buffer || image;
                const filename = image.originalname || `image-${Date.now()}`;
                const contentType = image.mimetype || 'image/jpeg';
                const key = `restaurants/${partnerId}/${Date.now()}-${filename}`;

                const imageUrl = await this.s3Service.uploadBuffer(
                    key,
                    content as Buffer,
                    contentType
                );
                uploadedImages.push(imageUrl);
            }
        }

        // 3. Create restaurant in database
        const restaurant = await this.prisma.restaurant.create({
            data: {
                name: dto.name,
                description: dto.description,
                cuisineTypes: dto.cuisineTypes,
                phone: dto.phone,
                email: dto.email,
                location: location, // JSON object
                deliveryFee: dto.deliveryFee,
                deliveryRadius: 5, // Default if not in DTO
                minimumOrder: dto.minimumOrder || 0,
                preparationTime: dto.preparationTime || 30,
                images: uploadedImages,
                coverImage: uploadedImages[0] || null,
                partnerId,
                isActive: false, // Needs admin approval
                isOpen: false,
            },
            include: {
                partner: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        // 4. Create default operating hours
        const operatingHours: any[] = [];
        for (let day = 0; day < 7; day++) {
            operatingHours.push({
                restaurantId: restaurant.id,
                dayOfWeek: day,
                openTime: '09:00',
                closeTime: '22:00',
                isClosed: false,
            });
        }
        await this.prisma.operatingHours.createMany({
            data: operatingHours,
        });

        // 5. Notify admins for approval
        this.realtimeGateway.emitToAdmins('restaurant:new_pending_approval', {
            restaurantId: restaurant.id,
            name: restaurant.name,
            partner: restaurant.partner?.user?.name || 'Unknown',
            createdAt: restaurant.createdAt,
        });

        // 6. Send notification to partner
        if (restaurant.partner?.userId) {
            await this.prisma.notification.create({
                data: {
                    userId: restaurant.partner.userId,
                    type: 'ORDER_PLACED' as any, // Placeholder as RESTAURANT_SUBMITTED not in Enum
                    title: 'Restaurant Submitted',
                    message: `Your restaurant "${restaurant.name}" has been submitted for approval. We'll review it within 24-48 hours.`,
                    data: { restaurantId: restaurant.id, type: 'RESTAURANT_SUBMITTED' },
                },
            });
        }

        // 7. Sync with Algolia
        await this.searchService.indexRestaurant(restaurant);

        return restaurant;
    }

    // ============= APPROVE RESTAURANT (ADMIN) =============
    async approveRestaurant(restaurantId: string, adminId: string) {
        // 1. Update restaurant status
        const restaurant = await this.prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                isActive: true,
                isOpen: true, // Auto-open on approval
            },
            include: {
                partner: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        // 2. Notify partner
        await this.prisma.notification.create({
            data: {
                userId: restaurant.partner.userId,
                type: 'ORDER_DELIVERED' as any, // Placeholder
                title: 'Restaurant Approved! 🎉',
                message: `Congratulations! Your restaurant "${restaurant.name}" has been approved and is now live.`,
                data: { restaurantId: restaurant.id, type: 'RESTAURANT_APPROVED' },
            },
        });

        // 3. Notify partner via WebSocket
        this.realtimeGateway.emitToCustomer(restaurant.partner.userId, 'restaurant:approved', {
            restaurantId: restaurant.id,
            name: restaurant.name,
        });

        // 4. ⭐ BROADCAST TO ALL CUSTOMER APPS - New restaurant is now visible!
        this.realtimeGateway.server.to('role:CUSTOMER').emit('restaurant:new_available', {
            restaurantId: restaurant.id,
            name: restaurant.name,
            cuisineTypes: restaurant.cuisineTypes,
            rating: restaurant.rating,
            deliveryFee: restaurant.deliveryFee,
            location: restaurant.location,
            coverImage: restaurant.coverImage,
        });

        // 5. Notify admins
        this.realtimeGateway.emitToAdmins('restaurant:approved', {
            restaurantId: restaurant.id,
            name: restaurant.name,
            approvedBy: adminId,
        });

        // 6. Sync with Algolia
        await this.searchService.indexRestaurant(restaurant);

        return restaurant;
    }

    // ============= GET NEARBY RESTAURANTS (FOR CUSTOMER APP) =============
    async getNearbyRestaurants(lat: number, lng: number, radius: number = 5) {
        // This uses PostGIS for efficient geospatial queries
        const restaurants = await this.prisma.$queryRaw`
      SELECT 
        r.*,
        (
          6371 * acos(
            cos(radians(${lat})) 
            * cos(radians((r.location->>'lat')::float)) 
            * cos(radians((r.location->>'lng')::float) - radians(${lng})) 
            + sin(radians(${lat})) 
            * sin(radians((r.location->>'lat')::float))
          )
        ) AS distance
      FROM "Restaurant" r
      WHERE 
        r."isActive" = true 
        AND r."isOpen" = true
        AND (
          6371 * acos(
            cos(radians(${lat})) 
            * cos(radians((r.location->>'lat')::float)) 
            * cos(radians((r.location->>'lng')::float) - radians(${lng})) 
            + sin(radians(${lat})) 
            * sin(radians((r.location->>'lat')::float))
          )
        ) <= ${radius}
      ORDER BY distance
      LIMIT 50
    `;

        return restaurants;
    }

    // ============= TOGGLE RESTAURANT STATUS =============
    async toggleRestaurantStatus(restaurantId: string, partnerId: string) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                partnerId,
            },
        });

        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }

        const updated = await this.prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                isOpen: !restaurant.isOpen,
            },
        });

        // Notify all customer apps about status change
        if (!updated.isOpen) {
            this.realtimeGateway.server.to('role:CUSTOMER').emit('restaurant:closed', {
                restaurantId: updated.id,
                name: updated.name,
            });
        } else {
            this.realtimeGateway.server.to('role:CUSTOMER').emit('restaurant:opened', {
                restaurantId: updated.id,
                name: updated.name,
            });
        }

        return updated;
    }

    // ============= UPDATE MENU ITEM =============
    async updateMenuItem(
        itemId: string,
        restaurantId: string,
        dto: UpdateMenuItemDto,
    ) {
        const item = await this.prisma.menuItem.update({
            where: {
                id: itemId,
                // category: { restaurantId }, // Prisma nested filter might need adjustment if category relation not direct or unique
            },
            data: dto,
        });

        // Notify all customer apps that menu has been updated
        this.realtimeGateway.server.emit('menu:item_updated', {
            restaurantId,
            itemId: item.id,
            isAvailable: item.isAvailable,
        });

        return item;
    }

    // ============= LEGACY / SUPPORT METHODS =============

    async findAll(filter: RestaurantFilterDto) {
        const { page = 1, limit = 10, cuisine, minRating, maxDeliveryFee } = filter;
        const skip = (page - 1) * limit;

        const where: Prisma.RestaurantWhereInput = {
            isActive: true,
        };

        if (cuisine) {
            where.cuisineTypes = { has: cuisine };
        }

        if (minRating) {
            where.rating = { gte: minRating };
        }

        if (maxDeliveryFee) {
            where.deliveryFee = { lte: maxDeliveryFee };
        }

        const [items, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                skip,
                take: limit,
                orderBy: { rating: 'desc' },
                include: { menuCategories: { take: 1 } }
            }),
            this.prisma.restaurant.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async findOne(id: string) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id },
            include: {
                menuCategories: {
                    include: { items: true },
                    orderBy: { displayOrder: 'asc' }
                },
                reviews: { take: 5, orderBy: { createdAt: 'desc' } }
            }
        });
        if (!restaurant) throw new NotFoundException('Restaurant not found');
        return restaurant;
    }

    async search(query: string) {
        return this.prisma.restaurant.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { cuisineTypes: { has: query } },
                ],
                isActive: true
            },
            take: 20
        });
    }

    async update(id: string, data: UpdateRestaurantDto) {
        return this.prisma.restaurant.update({
            where: { id },
            data
        });
    }

    async findByPartnerUserId(userId: string) {
        const partner = await this.prisma.restaurantPartner.findUnique({
            where: { userId }
        });
        if (!partner) return [];

        return this.prisma.restaurant.findMany({
            where: { partnerId: partner.id }
        });
    }

    async getStats(restaurantId: string) {
        // Stub implementation
        const orders = await this.prisma.order.count({ where: { restaurantId } });
        const revenue = await this.prisma.order.aggregate({
            where: { restaurantId, status: 'DELIVERED' },
            _sum: { totalAmount: true }
        });
        return {
            totalOrders: orders,
            totalRevenue: revenue._sum.totalAmount || 0,
            averageRating: 4.5
        };
    }

    async getAnalytics(restaurantId: string, range: string) {
        // Stub implementation
        return {
            range,
            data: [
                { date: '2023-12-01', orders: 12, revenue: 5000 },
                { date: '2023-12-02', orders: 15, revenue: 7000 },
            ]
        };
    }
}
