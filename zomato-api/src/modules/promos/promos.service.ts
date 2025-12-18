import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PromoValidationService } from './promo-validation.service';
import { Promo, DiscountType } from '@prisma/client';

@Injectable()
export class PromosService {
    constructor(
        private prisma: PrismaService,
        private validationService: PromoValidationService
    ) { }

    async createPromo(data: any) {
        return this.prisma.promo.create({ data });
    }

    async getAvailablePromos(userId: string, restaurantId: string) {
        const now = new Date();
        const promos = await this.prisma.promo.findMany({
            where: {
                isActive: true,
                validFrom: { lte: now },
                validUntil: { gte: now }
            }
        });

        // Filter by restaurant
        return promos.filter(p => {
            if (p.applicableRestaurantIds.length > 0 && !p.applicableRestaurantIds.includes(restaurantId)) return false;
            return true;
        });
    }

    async validatePromoCode(code: string, userId: string, cartValue: number, restaurantId: string) {
        const promo = await this.prisma.promo.findUnique({ where: { code: code.toUpperCase() } });
        if (!promo) return { valid: false, reason: 'Invalid promo code' };

        const validation = await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
        if (!validation.valid) return validation;

        const discountAmount = this.calculateDiscount(promo, cartValue);
        return {
            valid: true,
            promoId: promo.id,
            code: promo.code,
            discountType: promo.discountType,
            discountAmount,
            description: promo.description
        };
    }

    async applyPromo(code: string, userId: string, cartValue: number, restaurantId: string) {
        const promo = await this.prisma.promo.findUnique({ where: { code: code.toUpperCase() } });
        if (!promo) throw new NotFoundException('Invalid promo code');

        const validation = await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
        if (!validation.valid) throw new BadRequestException(validation.reason);

        const discountAmount = this.calculateDiscount(promo, cartValue);

        return {
            valid: true,
            promoId: promo.id,
            code: promo.code,
            discountType: promo.discountType,
            discountAmount,
            message: 'Promo applied successfully'
        };
    }

    async getBestPromo(userId: string, cartValue: number, restaurantId: string) {
        const availablePromos = await this.getAvailablePromos(userId, restaurantId);
        let bestPromo: { promo: Promo; discount: number } | null = null;

        for (const promo of availablePromos) {
            const validation = await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);
            if (!validation.valid) continue;

            const discount = this.calculateDiscount(promo, cartValue);
            if (!bestPromo || discount > bestPromo.discount) {
                bestPromo = { promo, discount };
            }
        }

        if (!bestPromo) return null;

        return {
            promoId: bestPromo.promo.id,
            code: bestPromo.promo.code,
            discountType: bestPromo.promo.discountType,
            discountAmount: bestPromo.discount,
            description: bestPromo.promo.description
        };
    }

    private calculateDiscount(promo: Promo, cartValue: number): number {
        if (promo.discountType === DiscountType.PERCENTAGE) {
            let discount = (cartValue * Number(promo.discountValue)) / 100;
            if (promo.maxDiscount && discount > Number(promo.maxDiscount)) {
                discount = Number(promo.maxDiscount);
            }
            return discount;
        } else if (promo.discountType === DiscountType.FIXED) {
            return Number(promo.discountValue);
        } else if (promo.discountType === DiscountType.FREE_DELIVERY) {
            return 0; // Handled separately
        }
        return 0;
    }

    async recordPromoUsage(promoId: string, userId: string, orderId: string) {
        await this.validationService.recordUsage(promoId, userId, orderId);
    }
}
