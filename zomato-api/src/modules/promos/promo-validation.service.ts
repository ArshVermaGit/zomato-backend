import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Promo } from '@prisma/client';

@Injectable()
export class PromoValidationService {
  constructor(private prisma: PrismaService) {}

  async validatePromo(
    promo: Promo,
    userId: string,
    cartValue: number,
    restaurantId: string,
  ): Promise<{ valid: boolean; reason?: string }> {
    const now = new Date();

    // 1. Basic Checks
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

    // 2. Restaurant Check
    if (
      promo.applicableRestaurantIds.length > 0 &&
      !promo.applicableRestaurantIds.includes(restaurantId)
    ) {
      return {
        valid: false,
        reason: 'Promo code not applicable for this restaurant',
      };
    }

    // 3. New User Check
    if (promo.isNewUserOnly) {
      const orderCount = await this.prisma.order.count({
        where: { customerId: userId },
      });
      if (orderCount > 0)
        return { valid: false, reason: 'Promo code valid for new users only' };
    }

    // 4. Per-User Usage Check
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

  async recordUsage(promoId: string, userId: string, orderId?: string) {
    await this.prisma.promoUsage.create({
      data: { promoId, userId, orderId },
    });
    // Increment global usedCount
    await this.prisma.promo.update({
      where: { id: promoId },
      data: { usedCount: { increment: 1 } },
    });
  }
}
