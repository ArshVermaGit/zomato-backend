import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
export declare class PaymentsService {
    private prisma;
    private razorpayService;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
    processPayment(dto: {
        amount: number;
        method: string;
        orderId: string;
        customerId: string;
    }): Promise<{
        transactionId: string;
        razorpayOrderId: string;
        amount: string | number;
        currency: string;
        status: string;
        key: string | undefined;
    }>;
    createPaymentOrder(userId: string, orderId: string): Promise<{
        transactionId: string;
        razorpayOrderId: string;
        amount: string | number;
        currency: string;
        status: string;
        key: string | undefined;
    }>;
    createAdHocPayment(userId: string, amount: number, purpose: string): Promise<{
        id: string;
        amount: string | number;
        currency: string;
        key: string | undefined;
    }>;
    verifyPayment(orderId: string | null, paymentId: string, razorpayOrderId: string, signature: string): Promise<{
        success: boolean;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        status: string;
    }>;
    private handlePaymentCaptured;
    private handlePaymentFailed;
}
