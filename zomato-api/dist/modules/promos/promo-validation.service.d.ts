import { PrismaService } from '../../database/prisma.service';
import { Promo } from '@prisma/client';
export declare class PromoValidationService {
    private prisma;
    constructor(prisma: PrismaService);
    validatePromo(promo: Promo, userId: string, cartValue: number, restaurantId: string): Promise<{
        valid: boolean;
        reason?: string;
    }>;
    recordUsage(promoId: string, userId: string, orderId?: string): Promise<void>;
}
