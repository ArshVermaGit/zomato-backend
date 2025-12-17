import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, NearbyRestaurantDto, UpdateMenuItemDto } from './dto/restaurant.dto';
import { Prisma } from '@prisma/client';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { S3Service } from '../../common/services/s3.service';
import { GeocodingService } from '../maps/geocoding.service';

@Injectable()
export class RestaurantsService {
    constructor(
        private prisma: PrismaService,
        private realtimeGateway: RealtimeGateway,
        private s3Service: S3Service,
        private geocodingService: GeocodingService,
    ) { }

    // ============= CREATE RESTAURANT =============
    async createRestaurant(partnerId: string, dto: CreateRestaurantDto, images?: Express.Multer.File[]) {
        // 1. Validate and geocode address if needed
        let location = dto.location;
        if (typeof dto.location === 'string') {
            const geocoded = await this.geocodingService.geocode(dto.location);
            if (!geocoded) {
                throw new BadRequestException('Invalid address');
            }
            location = {
                lat: geocoded.lat,
                lng: geocoded.lng,
                address: dto.location,
            };
        }

        // 2. Upload images to S3
        const uploadedImages: string[] = [];
        if (images && images.length > 0) {
            for (const image of images) {
                const imageUrl = await this.s3Service.uploadFile(
                    image.buffer,
                    `restaurants/${partnerId}/${Date.now()}-${image.originalname}`
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
                location: location,
                deliveryFee: dto.deliveryFee,
                deliveryRadius: 5, // Default
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
        const operatingHours = [];
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
            partner: restaurant.partner.user.name,
            createdAt: restaurant.createdAt,
        });

        // 6. Send notification to partner
        await this.prisma.notification.create({
            data: {
                userId: restaurant.partner.userId,
                type: 'ORDER_PLACED', // Using existing enum, ideally add RESTAURANT_SUBMITTED
                title: 'Restaurant Submitted',
                message: `Your restaurant "${restaurant.name}" has been submitted for approval. We'll review it within 24-48 hours.`,
                data: { restaurantId: restaurant.id },
            },
        });

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
                type: 'ORDER_DELIVERED', // Using existing enum, ideally add RESTAURANT_APPROVED
                title: 'Restaurant Approved! 🎉',
                message: `Congratulations! Your restaurant "${restaurant.name}" has been approved and is now live.`,
                data: { restaurantId: restaurant.id },
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
            ) <= r."deliveryRadius"
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

    // ============= EXISTING METHODS (Preserved) =============

    async create(data: CreateRestaurantDto) {
        const { partnerId, ...rest } = data;
        return this.prisma.restaurant.create({
            data: {
                ...rest,
                partner: { connect: { id: partnerId } }
            }
        });
    }

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
                    {
                        menuCategories: {
                            some: {
                                items: {
                                    some: {
                                        name: { contains: query, mode: 'insensitive' }
                                    }
                                }
                            }
                        }
                    }
                ],
                isActive: true
            },
            take: 20
        });
    }

    async findNearby(dto: NearbyRestaurantDto) {
        const { lat, lng, radius = 5 } = dto;

        const rawQuery = Prisma.sql`
      SELECT id, name, location, rating, "deliveryFee", "preparationTime",
      (
        6371 * acos(
          cos(radians(${lat})) * cos(radians(CAST(location->>'lat' AS FLOAT))) *
          cos(radians(CAST(location->>'lng' AS FLOAT)) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(CAST(location->>'lat' AS FLOAT)))
        )
      ) AS distance
      FROM "Restaurant"
      WHERE "isActive" = true
      AND (
        6371 * acos(
          cos(radians(${lat})) * cos(radians(CAST(location->>'lat' AS FLOAT))) *
          cos(radians(CAST(location->>'lng' AS FLOAT)) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(CAST(location->>'lat' AS FLOAT)))
        )
      ) < ${radius}
      ORDER BY distance ASC
      LIMIT 20;
    `;

        try {
            const results = await this.prisma.$queryRaw(rawQuery);
            return results;
        } catch (error) {
            console.error("Geospatial query error:", error);
            return [];
        }
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
}
