import { PrismaService } from '../../database/prisma.service';
import { Promo } from '@prisma/client';
export declare class PromoValidationService {
    private prisma;
    constructor(prisma: PrismaService);
    validatePromo(promo: Promo, userId: string, cartValue: number, restaurantId: string): unknown;
}
