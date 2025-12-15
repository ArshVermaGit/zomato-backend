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
const client_1 = require("@prisma/client");
let RestaurantsService = class RestaurantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { partnerId, ...rest } = data;
        return this.prisma.restaurant.create({
            data: {
                ...rest,
                partner: { connect: { id: partnerId } }
            }
        });
    }
    async findAll(filter) {
        const { page = 1, limit = 10, cuisine, vegOnly, minRating, maxDeliveryFee } = filter;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            isOpen: true,
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
    async findNearby(dto) {
        const { lat, lng, radius = 5 } = dto;
        const rawQuery = client_1.Prisma.sql `
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
        }
        catch (error) {
            console.error("Geospatial query error:", error);
            return [];
        }
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
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map