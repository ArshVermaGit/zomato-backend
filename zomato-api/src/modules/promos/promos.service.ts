import { Injectable, NotFoundException } from '@nestjs/common';
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

        // Simple filter
        return promos.filter(p => {
            if (p.applicableRestaurantIds.length > 0 && !p.applicableRestaurantIds.includes(restaurantId)) return false;
            return true;
        });
    }

    async applyPromo(code: string, userId: string, cartValue: number, restaurantId: string) {
        const promo = await this.prisma.promo.findUnique({ where: { code } });
        if (!promo) throw new NotFoundException('Invalid promo code');

        await this.validationService.validatePromo(promo, userId, cartValue, restaurantId);

        // Calculate Discount
        let discountAmount = 0;

        if (promo.discountType === DiscountType.PERCENTAGE) {
            discountAmount = (cartValue * Number(promo.discountValue)) / 100;
            if (promo.maxDiscount && discountAmount > Number(promo.maxDiscount)) {
                discountAmount = Number(promo.maxDiscount);
            }
        } else if (promo.discountType === DiscountType.FIXED) {
            discountAmount = Number(promo.discountValue);
        } else if (promo.discountType === DiscountType.FREE_DELIVERY) {
            // Logic handled by caller (e.g. set delivery fee to 0)
            // We return a specialized object or just value 0 here and a flag?
            // For simplicity, returning 0 as amount but client/order service handles 'type'.
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
}
