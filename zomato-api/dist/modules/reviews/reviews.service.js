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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const rating_calculation_service_1 = require("./rating-calculation.service");
const websocket_gateway_1 = require("../../websockets/websocket.gateway");
let ReviewsService = class ReviewsService {
    prisma;
    ratingService;
    realtimeGateway;
    constructor(prisma, ratingService, realtimeGateway) {
        this.prisma = prisma;
        this.ratingService = ratingService;
        this.realtimeGateway = realtimeGateway;
    }
    async createReview(userId, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
            include: { review: true, restaurant: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== userId)
            throw new common_1.BadRequestException('Not authorized to review this order');
        if (order.status !== 'DELIVERED')
            throw new common_1.BadRequestException('Can only review delivered orders');
        if (order.review)
            throw new common_1.BadRequestException('Order already reviewed');
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
            },
            include: { user: { select: { name: true, avatar: true } } }
        });
        this.ratingService.updateRestaurantRating(order.restaurantId);
        if (order.deliveryPartnerId && dto.deliveryRating) {
            this.ratingService.updateDeliveryPartnerRating(order.deliveryPartnerId);
        }
        this.realtimeGateway.emitToRestaurant(order.restaurantId, 'review:new', {
            reviewId: review.id,
            rating: review.rating,
            comment: review.comment,
            customerName: review.user.name,
            createdAt: review.createdAt
        });
        return review;
    }
    async getRestaurantReviews(restaurantId) {
        return this.prisma.review.findMany({
            where: { restaurantId, isReported: false },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, avatar: true } } }
        });
    }
    async markHelpful(reviewId) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { helpfulCount: { increment: 1 } }
        });
    }
    async reportReview(reviewId) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { isReported: true }
        });
    }
    async respondToReview(userId, reviewId, response) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const restaurant = await this.prisma.restaurant.findUnique({ where: { id: review.restaurantId } });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const partner = await this.prisma.restaurantPartner.findUnique({ where: { userId } });
        if (!partner || partner.id !== restaurant.partnerId) {
            throw new common_1.BadRequestException('Not authorized to respond to this review');
        }
        return this.prisma.review.update({
            where: { id: reviewId },
            data: {
                response,
                respondedAt: new Date()
            }
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rating_calculation_service_1.RatingCalculationService,
        websocket_gateway_1.RealtimeGateway])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map