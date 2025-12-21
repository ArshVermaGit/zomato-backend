import { PrismaService } from '../../database/prisma.service';
import { PromoValidationService } from './promo-validation.service';
export declare class PromosService {
    private prisma;
    private validationService;
    constructor(prisma: PrismaService, validationService: PromoValidationService);
    createPromo(data: any): Promise<any>;
    getAvailablePromos(userId: string, restaurantId: string): Promise<any>;
    validatePromoCode(code: string, userId: string, cartValue: number, restaurantId: string): Promise<{
        valid: boolean;
        reason?: string;
    } | {
        valid: boolean;
        promoId: any;
        code: any;
        discountType: any;
        discountAmount: number;
        description: any;
    }>;
    applyPromo(code: string, userId: string, cartValue: number, restaurantId: string): Promise<{
        valid: boolean;
        promoId: any;
        code: any;
        discountType: any;
        discountAmount: number;
        message: string;
    }>;
    getBestPromo(userId: string, cartValue: number, restaurantId: string): Promise<{
        promoId: any;
        code: any;
        discountType: any;
        discountAmount: number;
        description: any;
    } | null>;
    private calculateDiscount;
    recordPromoUsage(promoId: string, userId: string, orderId: string): Promise<void>;
}
