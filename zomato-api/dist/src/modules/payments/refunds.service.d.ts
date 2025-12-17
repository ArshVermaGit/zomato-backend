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
    processRefund(orderId: string, type?: 'GATEWAY' | 'WALLET', reason?: string): Promise<any>;
    private processGatewayRefund;
    private processWalletRefund;
}
