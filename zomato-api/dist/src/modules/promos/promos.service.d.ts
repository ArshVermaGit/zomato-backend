import { PrismaService } from '../../database/prisma.service';
import { PromoValidationService } from './promo-validation.service';
export declare class PromosService {
    private prisma;
    private validationService;
    constructor(prisma: PrismaService, validationService: PromoValidationService);
    createPromo(data: any): Promise<{
        description: string;
        id: string;
        isActive: boolean;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: import("@prisma/client-runtime-utils").Decimal;
        minOrderValue: import("@prisma/client-runtime-utils").Decimal;
        maxDiscount: import("@prisma/client-runtime-utils").Decimal | null;
        validFrom: Date;
        validUntil: Date;
        usageLimit: number | null;
        usedCount: number;
        applicableFor: string[];
    }>;
    getAvailablePromos(userId: string, restaurantId: string): Promise<{
        description: string;
        id: string;
        isActive: boolean;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountValue: import("@prisma/client-runtime-utils").Decimal;
        minOrderValue: import("@prisma/client-runtime-utils").Decimal;
        maxDiscount: import("@prisma/client-runtime-utils").Decimal | null;
        validFrom: Date;
        validUntil: Date;
        usageLimit: number | null;
        usedCount: number;
        applicableFor: string[];
    }[]>;
    applyPromo(code: string, userId: string, cartValue: number, restaurantId: string): Promise<{
        valid: boolean;
        promoId: string;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountAmount: number;
        message: string;
    }>;
}
