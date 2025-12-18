import { PromosService } from './promos.service';
export declare class PromosController {
    private promosService;
    constructor(promosService: PromosService);
    getAvailable(req: any, restaurantId: string): Promise<{
        description: string;
        id: string;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderValue: import("@prisma/client/runtime/library").Decimal;
        maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
        validFrom: Date;
        validUntil: Date;
        usageLimit: number | null;
        usedCount: number;
        maxUsagePerUser: number | null;
        isNewUserOnly: boolean;
        applicableFor: string[];
        applicableRestaurantIds: string[];
    }[]>;
    validatePromo(req: any, body: {
        code: string;
        cartValue: number;
        restaurantId: string;
    }): Promise<{
        valid: boolean;
        reason?: string;
    } | {
        valid: boolean;
        promoId: string;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountAmount: number;
        description: string;
    }>;
    applyPromo(req: any, body: {
        code: string;
        cartValue: number;
        restaurantId: string;
    }): Promise<{
        valid: boolean;
        promoId: string;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountAmount: number;
        message: string;
    }>;
    getBestPromo(req: any, cartValue: string, restaurantId: string): Promise<{
        promoId: string;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountAmount: number;
        description: string;
    } | null>;
    createPromo(body: any): Promise<{
        description: string;
        id: string;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: import("@prisma/client/runtime/library").Decimal;
        minOrderValue: import("@prisma/client/runtime/library").Decimal;
        maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
        validFrom: Date;
        validUntil: Date;
        usageLimit: number | null;
        usedCount: number;
        maxUsagePerUser: number | null;
        isNewUserOnly: boolean;
        applicableFor: string[];
        applicableRestaurantIds: string[];
    }>;
}
