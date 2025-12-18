import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
import { Prisma } from '@prisma/client';
export declare class RefundsService {
    private prisma;
    private razorpayService;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
    private calculateRefundPercentage;
    calculateRefund(orderId: string): Promise<{
        orderId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        refundPercentage: number;
        refundAmount: number;
        currency: string;
    }>;
    processRefund(orderId: string, type?: 'GATEWAY' | 'WALLET', reason?: string): Promise<void | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RefundStatus;
        orderId: string;
        amount: Prisma.Decimal;
        reason: string | null;
        gatewayRefundId: string | null;
    }>;
    private processGatewayRefund;
    private processWalletRefund;
}
