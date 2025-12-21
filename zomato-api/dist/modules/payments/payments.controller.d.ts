import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: any, body: {
        orderId: string;
    }): Promise<{
        transactionId: any;
        razorpayOrderId: string;
        amount: string | number;
        currency: string;
        status: string;
        key: string | undefined;
    }>;
    createAdHoc(req: any, body: {
        amount: number;
        purpose: string;
    }): Promise<{
        id: string;
        amount: string | number;
        currency: string;
        key: string | undefined;
    }>;
    verifyPayment(body: {
        orderId?: string;
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
