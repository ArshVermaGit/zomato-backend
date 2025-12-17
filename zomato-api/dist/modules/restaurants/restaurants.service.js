"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const websocket_gateway_1 = require("../../websockets/websocket.gateway");
const s3_service_1 = require("../../common/services/s3.service");
const geocoding_service_1 = require("../../common/services/geocoding.service");
let RestaurantsService = class RestaurantsService {
    prisma;
    realtimeGateway;
    s3Service;
    geocodingService;
    constructor(prisma, realtimeGateway, s3Service, geocodingService) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.s3Service = s3Service;
        this.geocodingService = geocodingService;
    }
    async createRestaurant(partnerId, dto) {
        const locationInput = dto.location;
        let location = locationInput;
        if (typeof locationInput === 'string') {
            const geocoded = await this.geocodingService.getCoordinates(locationInput);
            if (!geocoded) {
                throw new common_1.BadRequestException('Invalid address');
            }
            location = {
                lat: geocoded.lat,
                lng: geocoded.lng,
                address: locationInput,
            };
        }
        else if (locationInput && (!locationInput.lat || !locationInput.lng)) {
            if (locationInput.address) {
                const geocoded = await this.geocodingService.getCoordinates(locationInput.address);
                if (geocoded) {
                    location = { ...locationInput, lat: geocoded.lat, lng: geocoded.lng };
                }
            }
        }
        const uploadedImages = [];
        const dtoImages = dto.images;
        if (dtoImages && dtoImages.length > 0) {
            for (const image of dtoImages) {
                const content = image.buffer || image;
                const filename = image.originalname || `image-${Date.now()}`;
                const contentType = image.mimetype || 'image/jpeg';
                const key = `restaurants/${partnerId}/${Date.now()}-${filename}`;
                const imageUrl = await this.s3Service.uploadFile(key, content, contentType);
                uploadedImages.push(imageUrl);
            }
        }
        const restaurant = await this.prisma.restaurant.create({
            data: {
                name: dto.name,
                description: dto.description,
                cuisineTypes: dto.cuisineTypes,
                phone: dto.phone,
                email: dto.email,
                location: location,
                deliveryFee: dto.deliveryFee,
                deliveryRadius: 5,
                minimumOrder: dto.minimumOrder || 0,
                preparationTime: dto.preparationTime || 30,
                images: uploadedImages,
                coverImage: uploadedImages[0] || null,
                partnerId,
                isActive: false,
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
        this.realtimeGateway.emitToAdmins('restaurant:new_pending_approval', {
            restaurantId: restaurant.id,
            name: restaurant.name,
            partner: restaurant.partner?.user?.name || 'Unknown',
            createdAt: restaurant.createdAt,
        });
        if (restaurant.partner?.userId) {
            await this.prisma.notification.create({
                data: {
                    userId: restaurant.partner.userId,
                    type: 'ORDER_PLACED',
                    title: 'Restaurant Submitted',
                    message: `Your restaurant "${restaurant.name}" has been submitted for approval. We'll review it within 24-48 hours.`,
                    data: { restaurantId: restaurant.id, type: 'RESTAURANT_SUBMITTED' },
                },
            });
        }
        return restaurant;
    }
    async approveRestaurant(restaurantId, adminId) {
        const restaurant = await this.prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                isActive: true,
                isOpen: true,
            },
            include: {
                partner: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: restaurant.partner.userId,
                type: 'ORDER_DELIVERED',
                title: 'Restaurant Approved! 🎉',
                message: `Congratulations! Your restaurant "${restaurant.name}" has been approved and is now live.`,
                data: { restaurantId: restaurant.id, type: 'RESTAURANT_APPROVED' },
            },
        });
        this.realtimeGateway.emitToCustomer(restaurant.partner.userId, 'restaurant:approved', {
            restaurantId: restaurant.id,
            name: restaurant.name,
        });
        this.realtimeGateway.server.to('role:CUSTOMER').emit('restaurant:new_available', {
            restaurantId: restaurant.id,
            name: restaurant.name,
            cuisineTypes: restaurant.cuisineTypes,
            rating: restaurant.rating,
            deliveryFee: restaurant.deliveryFee,
            location: restaurant.location,
            coverImage: restaurant.coverImage,
        });
        this.realtimeGateway.emitToAdmins('restaurant:approved', {
            restaurantId: restaurant.id,
            name: restaurant.name,
            approvedBy: adminId,
        });
        return restaurant;
    }
    async getNearbyRestaurants(lat, lng, radius = 5) {
        const restaurants = await this.prisma.$queryRaw `
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
    async toggleRestaurantStatus(restaurantId, partnerId) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                partnerId,
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restaurant not found');
        }
        const updated = await this.prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                isOpen: !restaurant.isOpen,
            },
        });
        if (!updated.isOpen) {
            this.realtimeGateway.server.to('role:CUSTOMER').emit('restaurant:closed', {
                restaurantId: updated.id,
                name: updated.name,
            });
        }
        else {
            this.realtimeGateway.server.to('role:CUSTOMER').emit('restaurant:opened', {
                restaurantId: updated.id,
                name: updated.name,
            });
        }
        return updated;
    }
    async updateMenuItem(itemId, restaurantId, dto) {
        const item = await this.prisma.menuItem.update({
            where: {
                id: itemId,
            },
            data: dto,
        });
        this.realtimeGateway.server.emit('menu:item_updated', {
            restaurantId,
            itemId: item.id,
            isAvailable: item.isAvailable,
        });
        return item;
    }
    async findAll(filter) {
        const { page = 1, limit = 10, cuisine, minRating, maxDeliveryFee } = filter;
        const skip = (page - 1) * limit;
        const where = {
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
    async findOne(id) {
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
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        return restaurant;
    }
    async search(query) {
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
    async update(id, data) {
        return this.prisma.restaurant.update({
            where: { id },
            data
        });
    }
    async findByPartnerUserId(userId) {
        const partner = await this.prisma.restaurantPartner.findUnique({
            where: { userId }
        });
        if (!partner)
            return [];
        return this.prisma.restaurant.findMany({
            where: { partnerId: partner.id }
        });
    }
    async getStats(restaurantId) {
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
    async getAnalytics(restaurantId, range) {
        return {
            range,
            data: [
                { date: '2023-12-01', orders: 12, revenue: 5000 },
                { date: '2023-12-02', orders: 15, revenue: 7000 },
            ]
        };
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        websocket_gateway_1.RealtimeGateway,
        s3_service_1.S3Service,
        geocoding_service_1.GeocodingService])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map