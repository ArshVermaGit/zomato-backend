import { PrismaService } from '../../database/prisma.service';
export declare class PaymentWebhookService {
    private prisma;
    constructor(prisma: PrismaService);
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
    handleWebhook(payload: any, signature: string): unknown;
    private processPaymentSuccess;
    private processPaymentFailure;
}
