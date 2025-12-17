import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: any, body: {
        orderId: string;
    }): unknown;
    verifyPayment(body: {
        orderId: string;
        paymentId: string;
        razorpayOrderId: string;
        signature: string;
    }): unknown;
    handleWebhook(body: any, signature: string): unknown;
}
