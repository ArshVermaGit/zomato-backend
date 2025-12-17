import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private razorpayService: RazorpayService
    ) { }

    async createPaymentOrder(userId: string, orderId: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');

        if (order.customerId !== userId) throw new BadRequestException('Unauthorized access to order');

        // Create Razorpay Order
        const razorpayOrder = await this.razorpayService.createOrder(
            Number(order.totalAmount), // Use correct field from schema
            'INR',
            order.orderNumber
        );

        // Log Payment Attempt
        await this.prisma.paymentTransaction.create({
            data: {
                orderId: order.id,
                gatewayTransactionId: razorpayOrder.id,
                amount: Number(order.totalAmount),
                status: PaymentStatus.PENDING,
                method: PaymentMethod.UPI // Default or from context? Assuming unknown or defaulting logic needed.
                // Schema requires method. Let's look at arg. It doesn't pass method.
            }
        });

        return {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        };
    }

    async verifyPayment(orderId: string, paymentId: string, razorpayOrderId: string, signature: string) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) throw new Error('Razorpay secret not configured');

        // Signature Verification: HMAC SHA256(order_id + "|" + payment_id, secret)
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpayOrderId + '|' + paymentId)
            .digest('hex');

        if (generatedSignature !== signature) {
            throw new BadRequestException('Invalid Payment Signature');
        }

        // Update Payment Record
        const payment = await this.prisma.paymentTransaction.findFirst({
            where: { gatewayTransactionId: razorpayOrderId }
        });

        if (payment) {
            await this.prisma.paymentTransaction.update({
                where: { id: payment.id },
                data: {
                    status: PaymentStatus.COMPLETED,
                    gatewayTransactionId: paymentId, // Update or keep? usually `razorpay_payment_id` is distinct.
                    // Schema has gatewayTransactionId (String). Maybe store paymentId there? 
                    // Original code used `razorpayPaymentId`. 
                    // Let's store in gatewayResponse if strictly following schema or override.
                    gatewayResponse: { razorpayPaymentId: paymentId, signature }
                }
            });
        }

        // Update Order Status
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'COMPLETED',
                // Assuming ACCEPTED is next state after payment, or stays PENDING until Restaurant accepts?
                // Usually Payment -> ACCEPTED (if auto) or PENDING_CONFIRMATION
                // Let's set PaymentStatus only. Logic for OrderStatus might reside in OrderStateService.
            }
        });

        return { success: true };
    }
}
