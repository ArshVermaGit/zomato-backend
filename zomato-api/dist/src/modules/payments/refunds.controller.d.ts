import { RefundsService } from './refunds.service';
export declare class RefundsController {
    private refundsService;
    constructor(refundsService: RefundsService);
    calculateRefund(orderId: string): Promise<{
        orderId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        refundPercentage: number;
        refundAmount: number;
        currency: string;
    }>;
    processRefund(orderId: string, type: 'GATEWAY' | 'WALLET', reason: string): Promise<void | {
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.RefundStatus;
        reason: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        paymentId: string;
    }>;
}
