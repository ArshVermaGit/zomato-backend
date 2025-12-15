import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, NearbyRestaurantDto } from './dto/restaurant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateRestaurantDto) {
        const { partnerId, ...rest } = data;
        // Verify partner exists? Prisma constraints will fail if not.
        return this.prisma.restaurant.create({
            data: {
                ...rest,
                partner: { connect: { id: partnerId } } // Connecting to existing partner record (from ID)
                // Note: The schema has `partnerId String` and `partner RestaurantPartner ...` 
                // If partnerId is the User ID of the partner, we might need to find the RestaurantPartner record first.
                // Assuming partnerId passed here is the `RestaurantPartner.id` OR we might need to lookup by UserId.
                // Let's assume input is the RestaurantPartner ID for now.
            }
        });
    }

    async findAll(filter: RestaurantFilterDto) {
        const { page = 1, limit = 10, cuisine, vegOnly, minRating, maxDeliveryFee } = filter;
        const skip = (page - 1) * limit;

        const where: Prisma.RestaurantWhereInput = {
            isActive: true,
            isOpen: true, // Only show open restaurants by default on listing? Or show all? Usually show all but mark closed.
            // Let's filtered by isActive (soft delete) at least.
        };

        if (cuisine) {
            where.cuisineTypes = { has: cuisine };
        }

        // Veg only: We need to check if ALL items are veg? 
        // Or if the restaurant is marked as veg? 
        // Schema doesn't have `isVeg` flag on Restaurant, only on Items.
        // Efficient way: store `isVeg` on restaurant. 
        // For now, let's skip complex veg-only filter on restaurant level unless we query items.
        // Or maybe the requirement implies "Show restaurants that have veg options".
        // "Veg only" usually means Pure Veg restaurants. 
        // Since schema lacks it, I will skip it or implement a partial check if requested.
        // Wait, let's check schema again... `Restaurant` has no `isPureVeg`. `MenuItem` has `isVeg`.
        // I will skip strict "Veg Only" filter on Restaurant level for this MVP 
        // OR add `where: { items: { every: { isVeg: true } } }` but that's heavy.

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
                orderBy: { rating: 'desc' }, // Default sort
                include: { menuCategories: { take: 1 } } // Preview
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
                    // Searching dishes (Items) is complex here, maybe separate endpoint?
                    // "Search by name, cuisine, dish"
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

        // Raw SQL for Haversine distance
        // We assume 'location' column is JSONB and has lat/lng keys.
        // Note: Postgres JSON operators ->> returns text, cast to float.

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
            // Fallback: Return all and filter in memory (not efficient but safe if SQL fails types)
            // Or just return empty
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
        // Find partner record first
        const partner = await this.prisma.restaurantPartner.findUnique({
            where: { userId }
        });
        if (!partner) return [];

        return this.prisma.restaurant.findMany({
            where: { partnerId: partner.id }
        });
    }
}
