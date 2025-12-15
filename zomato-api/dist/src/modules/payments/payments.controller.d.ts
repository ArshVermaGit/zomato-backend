import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: any, body: {
        orderId: string;
    }): Promise<{
        id: string;
        amount: string | number;
        currency: string;
    }>;
    verifyPayment(body: {
        orderId: string;
        paymentId: string;
        razorpayOrderId: string;
        signature: string;
    }): Promise<{
        success: boolean;
    }>;
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
}
