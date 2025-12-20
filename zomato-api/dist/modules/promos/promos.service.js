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
exports.PromosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const promo_validation_service_1 = require("./promo-validation.service");
const client_1 = require("@prisma/client");
let PromosService = class PromosService {
    prisma;
    validationService;
    constructor(prisma, validationService) {
        this.prisma = prisma;
        this.validationService = validationService;
    }
    async createPromo(data) {
        return this.prisma.promo.create({ data });
    }
    async getAvailablePromos(userId, restaurantId) {
        const now = new Date();
        const promos = await this.prisma.promo.findMany({
            where: {
                isActive: true,
                validFrom: { lte: now },
                validUntil: { gte: now },
            },
        });
        return promos.filter((p) => {
            if (p.applicableRestaurantIds.length > 0 &&
                !p.applicableRestaurantIds.includes(restaurantId))
                return false;
            return true;
        });
    }
    async validatePromoCode(code, userId, cartValue, restaurantId) {
        const promo = await this.prisma.promo.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!promo)
            return { valid: false, reason: 'Invalid promo code' };
        const validation = await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
        if (!validation.valid)
            return validation;
        const discountAmount = this.calculateDiscount(promo, cartValue);
        return {
            valid: true,
            promoId: promo.id,
            code: promo.code,
            discountType: promo.discountType,
            discountAmount,
            description: promo.description,
        };
    }
    async applyPromo(code, userId, cartValue, restaurantId) {
        const promo = await this.prisma.promo.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!promo)
            throw new common_1.NotFoundException('Invalid promo code');
        const validation = await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
        if (!validation.valid)
            throw new common_1.BadRequestException(validation.reason);
        const discountAmount = this.calculateDiscount(promo, cartValue);
        return {
            valid: true,
            promoId: promo.id,
            code: promo.code,
            discountType: promo.discountType,
            discountAmount,
            message: 'Promo applied successfully',
        };
    }
    async getBestPromo(userId, cartValue, restaurantId) {
        const availablePromos = await this.getAvailablePromos(userId, restaurantId);
        let bestPromo = null;
        for (const promo of availablePromos) {
            const validation = await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
            if (!validation.valid)
                continue;
            const discount = this.calculateDiscount(promo, cartValue);
            if (!bestPromo || discount > bestPromo.discount) {
                bestPromo = { promo, discount };
            }
        }
        if (!bestPromo)
            return null;
        return {
            promoId: bestPromo.promo.id,
            code: bestPromo.promo.code,
            discountType: bestPromo.promo.discountType,
            discountAmount: bestPromo.discount,
            description: bestPromo.promo.description,
        };
    }
    calculateDiscount(promo, cartValue) {
        if (promo.discountType === client_1.DiscountType.PERCENTAGE) {
            let discount = (cartValue * Number(promo.discountValue)) / 100;
            if (promo.maxDiscount && discount > Number(promo.maxDiscount)) {
                discount = Number(promo.maxDiscount);
            }
            return discount;
        }
        else if (promo.discountType === client_1.DiscountType.FIXED) {
            return Number(promo.discountValue);
        }
        else if (promo.discountType === client_1.DiscountType.FREE_DELIVERY) {
            return 0;
        }
        return 0;
    }
    async recordPromoUsage(promoId, userId, orderId) {
        await this.validationService.recordUsage(promoId, userId, orderId);
    }
};
exports.PromosService = PromosService;
exports.PromosService = PromosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promo_validation_service_1.PromoValidationService])
], PromosService);
//# sourceMappingURL=promos.service.js.map