import { PromosService } from './promos.service';
export declare class PromosController {
    private promosService;
    constructor(promosService: PromosService);
    getAvailable(req: any, restaurantId: string): Promise<{
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
    applyPromo(req: any, body: {
        code: string;
        cartValue: number;
        restaurantId: string;
    }): Promise<{
        valid: boolean;
        promoId: string;
        code: string;
        discountType: import("@prisma/client").$Enums.DiscountType;
        discountAmount: number;
        message: string;
    }>;
    createPromo(body: any): Promise<{
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
}
