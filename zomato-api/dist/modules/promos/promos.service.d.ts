import { PrismaService } from '../../database/prisma.service';
import { PromoValidationService } from './promo-validation.service';
export declare class PromosService {
    private prisma;
    private validationService;
    constructor(prisma: PrismaService, validationService: PromoValidationService);
    createPromo(data: any): unknown;
    getAvailablePromos(userId: string, restaurantId: string): unknown;
    applyPromo(code: string, userId: string, cartValue: number, restaurantId: string): unknown;
}
