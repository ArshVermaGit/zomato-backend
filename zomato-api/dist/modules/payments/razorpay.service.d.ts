export declare class RazorpayService {
    private razorpay;
    constructor();
    createOrder(amount: number, currency: string | undefined, receipt: string): unknown;
    fetchPayment(paymentId: string): unknown;
    refundPayment(paymentId: string, amount: number, notes?: any): unknown;
}
