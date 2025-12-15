import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
export declare class PaymentsService {
    private prisma;
    private razorpayService;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
    createPaymentOrder(userId: string, orderId: string): Promise<{
        id: string;
        amount: string | number;
        currency: string;
    }>;
    verifyPayment(orderId: string, paymentId: string, razorpayOrderId: string, signature: string): Promise<{
        success: boolean;
    }>;
}
