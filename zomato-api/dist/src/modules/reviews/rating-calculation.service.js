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
exports.RatingCalculationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let RatingCalculationService = class RatingCalculationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateRestaurantRating(restaurantId) {
        const reviews = await this.prisma.review.findMany({
            where: { restaurantId },
            select: { rating: true, createdAt: true }
        });
        if (reviews.length === 0)
            return;
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
    async updateDeliveryPartnerRating(partnerId) {
        const orders = await this.prisma.order.findMany({
            where: { deliveryPartnerId: partnerId, status: 'DELIVERED', review: { isNot: null } },
            include: { review: true }
        });
        if (orders.length === 0)
            return;
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
};
exports.RatingCalculationService = RatingCalculationService;
exports.RatingCalculationService = RatingCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingCalculationService);
//# sourceMappingURL=rating-calculation.service.js.map