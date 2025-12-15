import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
export declare class RefundsService {
    private prisma;
    private razorpayService;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
    private calculateRefundPercentage;
    calculateRefund(orderId: string): Promise<{
        orderId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        refundPercentage: number;
        refundAmount: number;
        currency: string;
    }>;
    processRefund(orderId: string, type?: 'GATEWAY' | 'WALLET', reason?: string): Promise<void | {
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.RefundStatus;
        reason: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        paymentId: string;
    }>;
    private processGatewayRefund;
    private processWalletRefund;
}
