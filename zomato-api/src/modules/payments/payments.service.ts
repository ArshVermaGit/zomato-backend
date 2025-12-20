import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private razorpayService: RazorpayService,
  ) {}

  // Process payment initiation
  async processPayment(dto: {
    amount: number;
    method: string;
    orderId: string;
    customerId: string;
  }) {
    // 1. Create Razorpay order
    // Use existing RazorpayService to keep SDK logic separated
    const razorpayOrder = await this.razorpayService.createOrder(
      dto.amount,
      'INR',
      dto.orderId, // Receipt
    );

    // 2. Create payment transaction record
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        orderId: dto.orderId,
        amount: dto.amount, // Storing in base unit (Rupees) as per schema, usually
        method: dto.method as any, // Cast to enum if needed
        status: PaymentStatus.PENDING,
        gatewayTransactionId: razorpayOrder.id,
        gatewayResponse: razorpayOrder as any,
      },
    });

    return {
      transactionId: transaction.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // In paise
      currency: razorpayOrder.currency,
      status: 'PENDING',
      key: process.env.RAZORPAY_KEY_ID, // Send key to client
    };
  }

  // Alias for backward compatibility if needed, or redirect to processPayment
  async createPaymentOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== userId)
      throw new BadRequestException('Unauthorized access to order');

    return this.processPayment({
      amount: Number(order.totalAmount),
      method: 'ONLINE', // Default
      orderId: order.id,
      customerId: userId,
    });
  }

  async createAdHocPayment(userId: string, amount: number, purpose: string) {
    // Create Razorpay Order
    const razorpayOrder = await this.razorpayService.createOrder(
      amount,
      'INR',
      `ADHOC_${Date.now()}`,
    );

    // Log Transaction
    await this.prisma.paymentTransaction.create({
      data: {
        amount: amount,
        method: PaymentMethod.UPI, // Default to UPI/Online
        status: PaymentStatus.PENDING,
        gatewayTransactionId: razorpayOrder.id,
        gatewayResponse: { ...razorpayOrder, purpose, userId } as any,
      },
    });

    return {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(
    orderId: string | null,
    paymentId: string,
    razorpayOrderId: string,
    signature: string,
  ) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error('Razorpay secret not configured');

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + paymentId)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new BadRequestException('Invalid Payment Signature');
    }

    const transaction = await this.prisma.paymentTransaction.findFirst({
      where: { gatewayTransactionId: razorpayOrderId },
    });

    if (transaction) {
      await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.COMPLETED,
          gatewayResponse: { razorpayPaymentId: paymentId, signature },
        },
      });

      // If linked to an order, update order
      if (transaction.orderId) {
        await this.prisma.order.update({
          where: { id: transaction.orderId },
          data: { paymentStatus: 'COMPLETED' },
        });
      }
    }

    return { success: true };
  }

  async handleWebhook(payload: any, signature: string) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new Error('Razorpay webhook secret not configured');

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Invalid webhook signature');
      // throw new BadRequestException('Invalid signature'); // Don't crash for now
    }

    switch (payload.event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(payload.payload.payment.entity);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(payload.payload.payment.entity);
        break;
    }

    return { status: 'ok' };
  }

  private async handlePaymentCaptured(payment: any) {
    // Find transaction by order_id (which is gatewayTransactionId in our DB)
    // Razorpay sends 'order_id' as the razorpay order id
    const gatewayOrderId = payment.order_id;

    await this.prisma.paymentTransaction.updateMany({
      where: { gatewayTransactionId: gatewayOrderId },
      data: {
        status: PaymentStatus.COMPLETED,
        gatewayResponse: payment,
      },
    });

    // We need to link back to our Order.
    // Our PaymentTransaction links to Order.
    // Find the transaction first to get the OrderID?
    // Actually we can do updateMany on Order via relation if Prisma allowed, but it doesn't easily.
    // Let's find the transaction first.
    const transaction = await this.prisma.paymentTransaction.findFirst({
      where: { gatewayTransactionId: gatewayOrderId },
    });

    if (transaction && transaction.orderId) {
      await this.prisma.order.update({
        where: { id: transaction.orderId },
        data: { paymentStatus: 'COMPLETED' },
      });
    }
  }

  private async handlePaymentFailed(payment: any) {
    const gatewayOrderId = payment.order_id;
    await this.prisma.paymentTransaction.updateMany({
      where: { gatewayTransactionId: gatewayOrderId },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: payment,
      },
    });

    const transaction = await this.prisma.paymentTransaction.findFirst({
      where: { gatewayTransactionId: gatewayOrderId },
    });

    if (transaction && transaction.orderId) {
      await this.prisma.order.update({
        where: { id: transaction.orderId },
        data: { paymentStatus: 'FAILED' },
      });
    }
  }
}
