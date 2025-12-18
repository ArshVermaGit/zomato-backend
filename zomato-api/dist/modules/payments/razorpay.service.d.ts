export declare class RazorpayService {
    private razorpay;
    constructor();
    createOrder(amount: number, currency: string | undefined, receipt: string): Promise<import("razorpay/dist/types/orders").Orders.RazorpayOrder>;
    fetchPayment(paymentId: string): Promise<import("razorpay/dist/types/payments").Payments.RazorpayPayment>;
    refundPayment(paymentId: string, amount: number, notes?: any): Promise<import("razorpay/dist/types/refunds").Refunds.RazorpayRefund>;
}
