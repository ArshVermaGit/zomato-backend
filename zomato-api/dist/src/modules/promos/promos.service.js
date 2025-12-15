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
                validUntil: { gte: now }
            }
        });
        return promos.filter(p => {
            if (p.applicableRestaurantIds.length > 0 && !p.applicableRestaurantIds.includes(restaurantId))
                return false;
            return true;
        });
    }
    async applyPromo(code, userId, cartValue, restaurantId) {
        const promo = await this.prisma.promo.findUnique({ where: { code } });
        if (!promo)
            throw new common_1.NotFoundException('Invalid promo code');
        await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
        let discountAmount = 0;
        if (promo.discountType === client_1.DiscountType.PERCENTAGE) {
            discountAmount = (cartValue * Number(promo.discountValue)) / 100;
            if (promo.maxDiscount && discountAmount > Number(promo.maxDiscount)) {
                discountAmount = Number(promo.maxDiscount);
            }
        }
        else if (promo.discountType === client_1.DiscountType.FIXED) {
            discountAmount = Number(promo.discountValue);
        }
        else if (promo.discountType === client_1.DiscountType.FREE_DELIVERY) {
            discountAmount = 0;
        }
        return {
            valid: true,
            promoId: promo.id,
            code: promo.code,
            discountType: promo.discountType,
            discountAmount: discountAmount,
            message: 'Promo applied successfully'
        };
    }
};
exports.PromosService = PromosService;
exports.PromosService = PromosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promo_validation_service_1.PromoValidationService])
], PromosService);
//# sourceMappingURL=promos.service.js.map