import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RatingCalculationService } from './rating-calculation.service';
import { CreateReviewDto } from './dto/create-review.dto'; // We will define this inline or create file

@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService,
        private ratingService: RatingCalculationService
    ) { }

    async createReview(userId: string, dto: any) {
        // 1. Verify Order
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
            include: { review: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.customerId !== userId) throw new BadRequestException('Not authorized to review this order');
        if (order.status !== 'DELIVERED') throw new BadRequestException('Can only review delivered orders');
        if (order.review) throw new BadRequestException('Order already reviewed');

        // 2. Create Review
        const review = await this.prisma.review.create({
            data: {
                userId,
                orderId: dto.orderId,
                restaurantId: order.restaurantId,
                rating: dto.rating,
                deliveryRating: dto.deliveryRating,
                comment: dto.comment,
                tags: dto.tags || [],
                images: dto.images || []
            }
        });

        // 3. Trigger Async Recalculation
        this.ratingService.updateRestaurantRating(order.restaurantId);
        if (order.deliveryPartnerId && dto.deliveryRating) {
            this.ratingService.updateDeliveryPartnerRating(order.deliveryPartnerId);
        }

        return review;
    }

    async getRestaurantReviews(restaurantId: string) {
        return this.prisma.review.findMany({
            where: { restaurantId, isReported: false },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, avatar: true } } }
        });
    }

    async markHelpful(reviewId: string) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { helpfulCount: { increment: 1 } }
        });
    }

    async reportReview(reviewId: string) {
        // In a real app, create a Report entity. Here, just flag it.
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { isReported: true }
        });
    }

    async respondToReview(userId: string, reviewId: string, response: string) {
        // Verify user is the restaurant owner for this review
        // Simplify: Assume Auth Guard checked "RESTAURANT_PARTNER" role, 
        // Need to check ownership.
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review) throw new NotFoundException('Review not found');

        const restaurant = await this.prisma.restaurant.findUnique({ where: { id: review.restaurantId } });
        if (!restaurant) throw new NotFoundException('Restaurant not found');

        const partner = await this.prisma.restaurantPartner.findUnique({ where: { userId } });

        if (!partner || partner.id !== restaurant.partnerId) {
            throw new BadRequestException('Not authorized to respond to this review');
        }

        return this.prisma.review.update({
            where: { id: reviewId },
            data: {
                response,
                respondedAt: new Date()
            }
        });
    }
}
