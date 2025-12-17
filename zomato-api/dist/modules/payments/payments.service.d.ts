import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
export declare class PaymentsService {
    private prisma;
    private razorpayService;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
    createPaymentOrder(userId: string, orderId: string): unknown;
    verifyPayment(orderId: string, paymentId: string, razorpayOrderId: string, signature: string): unknown;
}
