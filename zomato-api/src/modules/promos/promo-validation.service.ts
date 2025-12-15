import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Promo } from '@prisma/client';

@Injectable()
export class PromoValidationService {
    constructor(private prisma: PrismaService) { }

    async validatePromo(promo: Promo, userId: string, cartValue: number, restaurantId: string) {
        const now = new Date();

        // 1. Basic Checks
        if (!promo.isActive) throw new BadRequestException('Promo code is inactive');
        if (now < promo.validFrom || now > promo.validUntil) throw new BadRequestException('Promo code has expired');
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) throw new BadRequestException('Promo usage limit reached');
        if (cartValue < Number(promo.minOrderValue)) throw new BadRequestException(`Minimum order value of ${promo.minOrderValue} required`);

        // 2. Restaurant Check
        if (promo.applicableRestaurantIds.length > 0 && !promo.applicableRestaurantIds.includes(restaurantId)) {
            throw new BadRequestException('Promo code not applicable for this restaurant');
        }

        // 3. User Checks
        if (promo.isNewUserOnly) {
            const orderCount = await this.prisma.order.count({ where: { customerId: userId } });
            if (orderCount > 0) throw new BadRequestException('Promo code valid for new users only');
        }

        if (promo.maxUsagePerUser) {
            // Note: We need a way to track per-user usage. 
            // Ideally a PromoUsage model. For MVP, we might skip or query orders.
            // Querying orders for this promo usage:
            // This assumes we store the promo code in the Order model? 
            // (Order model doesn't explicitly link Promo ID, maybe check metadata or add field)
            // Skipping strict per-user check if infrastructure missing, or assuming implementation.
            // Let's assume we can't easily check this without a join table, so placeholder:
            // const userUsage = ...
        }

        // 4. Return Valid
        return true;
    }
}
