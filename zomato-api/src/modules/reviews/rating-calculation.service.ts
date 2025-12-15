import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RatingCalculationService {
    constructor(private prisma: PrismaService) { }

    async updateRestaurantRating(restaurantId: string) {
        // Fetch all reviews for this restaurant
        const reviews = await this.prisma.review.findMany({
            where: { restaurantId },
            select: { rating: true, createdAt: true }
        });

        if (reviews.length === 0) return;

        // Weighted Average: Reviews in last 30 days get 1.5x weight
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        let totalWeightedRating = 0;
        let totalWeight = 0;

        for (const review of reviews) {
            const weight = review.createdAt > thirtyDaysAgo ? 1.5 : 1.0;
            totalWeightedRating += review.rating * weight;
            totalWeight += weight;
        }

        const newRating = totalWeight > 0 ? totalWeightedRating / totalWeight : 0;

        await this.prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                rating: Number(newRating.toFixed(1)),
                totalRatings: reviews.length
            }
        });
    }

    async updateDeliveryPartnerRating(partnerId: string) {
        // Similar logic for Delivery Partner
        /*
        * Note: Delivery Rating is not directly linked to DeliveryPartner in Review schema 
        * unless we infer it via Order -> DeliveryPartner.
        * The Review model has orderId, so we can fetch order -> deliveryPartnerId.
        */

        // This query might be expensive if not careful. 
        // Better approach: When adding a review, we know the order and partner.
        // But to recalculate ALL, we need to join.

        // Simplified: Just update for the specific partner involved in the current review trigger
        // We will pass partnerId to this method.

        // Fetch reviews where order -> deliveryPartnerId == partnerId
        // This requires a deep join or finding orders first.
        // For MVP, simplified average of all reviews linked to this partner (via order)

        const orders = await this.prisma.order.findMany({
            where: { deliveryPartnerId: partnerId, status: 'DELIVERED', review: { isNot: null } },
            include: { review: true }
        });

        if (orders.length === 0) return;

        let total = 0;
        let count = 0;

        for (const order of orders) {
            if (order.review?.deliveryRating) {
                total += order.review.deliveryRating;
                count++;
            }
        }

        const newRating = count > 0 ? total / count : 0;

        await this.prisma.deliveryPartner.update({
            where: { id: partnerId },
            data: {
                rating: Number(newRating.toFixed(1))
            }
        });
    }
}
