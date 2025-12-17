import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
export declare class RefundsService {
    private prisma;
    private razorpayService;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
    private calculateRefundPercentage;
    calculateRefund(orderId: string): unknown;
    processRefund(orderId: string, type?: 'GATEWAY' | 'WALLET', reason?: string): unknown;
    private processGatewayRefund;
    private processWalletRefund;
}
