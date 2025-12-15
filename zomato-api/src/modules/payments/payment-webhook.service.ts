import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PaymentStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PaymentWebhookService {
    constructor(private prisma: PrismaService) { }

    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
        return expectedSignature === signature;
    }

    async handleWebhook(payload: any, signature: string) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error('Webhook secret missing');
            // Proceeding insecurely or throwing error? Best to throw.
            throw new Error('Webhook secret not configured');
        }

        if (!this.verifyWebhookSignature(JSON.stringify(payload), signature, secret)) {
            throw new BadRequestException('Invalid Webhook Signature');
        }

        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;

        // Idempotency: Ideally logging event IDs. For now relying on Payment Status checks.

        if (event === 'payment.captured') {
            await this.processPaymentSuccess(paymentEntity);
        } else if (event === 'payment.failed') {
            await this.processPaymentFailure(paymentEntity);
        } else if (event === 'refund.processed') {
            // Handle Refund Webhook if needed for Async updates
        }

        return { status: 'ok' };
    }

    private async processPaymentSuccess(razorpayPayment: any) {
        const razorpayOrderId = razorpayPayment.order_id;
        const amount = razorpayPayment.amount; // In paise

        const payment = await this.prisma.payment.findFirst({ where: { razorpayOrderId } });

        if (payment && payment.status !== PaymentStatus.COMPLETED) {
            // Update Payment
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: PaymentStatus.COMPLETED,
                    razorpayPaymentId: razorpayPayment.id,
                    method: razorpayPayment.method
                }
            });

            // Update Order
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'COMPLETED' }
            });
            console.log(`Payment captured for Order ${payment.orderId}`);
        }
    }

    private async processPaymentFailure(razorpayPayment: any) {
        const razorpayOrderId = razorpayPayment.order_id;
        const payment = await this.prisma.payment.findFirst({ where: { razorpayOrderId } });

        if (payment) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: PaymentStatus.FAILED,
                    razorpayPaymentId: razorpayPayment.id
                }
            });
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'FAILED' }
            });
        }
    }
}
