export declare class RazorpayService {
    private razorpay;
    constructor();
    createOrder(amount: number, currency: string | undefined, receipt: string): Promise<any>;
    fetchPayment(paymentId: string): Promise<any>;
    refundPayment(paymentId: string, amount: number, notes?: any): Promise<any>;
}
