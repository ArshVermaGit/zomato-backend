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
exports.PromoValidationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PromoValidationService = class PromoValidationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validatePromo(promo, userId, cartValue, restaurantId) {
        const now = new Date();
        if (!promo.isActive)
            return { valid: false, reason: 'Promo code is inactive' };
        if (now < promo.validFrom || now > promo.validUntil)
            return { valid: false, reason: 'Promo code has expired' };
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit)
            return { valid: false, reason: 'Promo usage limit reached' };
        if (cartValue < Number(promo.minOrderValue))
            return {
                valid: false,
                reason: `Minimum order value of ₹${promo.minOrderValue.toString()} required`,
            };
        if (promo.applicableRestaurantIds.length > 0 &&
            !promo.applicableRestaurantIds.includes(restaurantId)) {
            return {
                valid: false,
                reason: 'Promo code not applicable for this restaurant',
            };
        }
        if (promo.isNewUserOnly) {
            const orderCount = await this.prisma.order.count({
                where: { customerId: userId },
            });
            if (orderCount > 0)
                return { valid: false, reason: 'Promo code valid for new users only' };
        }
        if (promo.maxUsagePerUser) {
            const userUsageCount = await this.prisma.promoUsage.count({
                where: { promoId: promo.id, userId },
            });
            if (userUsageCount >= promo.maxUsagePerUser) {
                return {
                    valid: false,
                    reason: `You have already used this promo ${promo.maxUsagePerUser} time(s)`,
                };
            }
        }
        return { valid: true };
    }
    async recordUsage(promoId, userId, orderId) {
        await this.prisma.promoUsage.create({
            data: { promoId, userId, orderId },
        });
        await this.prisma.promo.update({
            where: { id: promoId },
            data: { usedCount: { increment: 1 } },
        });
    }
};
exports.PromoValidationService = PromoValidationService;
exports.PromoValidationService = PromoValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromoValidationService);
//# sourceMappingURL=promo-validation.service.js.map