import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    // Ideally load from environment variables
    // For now, checks if env vars are present, else logs warning
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    } else {
      console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set');
    }
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    if (!this.razorpay)
      throw new InternalServerErrorException('Payment gateway not configured');

    try {
      return await this.razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
      });
    } catch (error) {
      console.error('Razorpay Create Order Error:', error);
      throw new InternalServerErrorException('Failed to create payment order');
    }
  }

  async fetchPayment(paymentId: string) {
    if (!this.razorpay)
      throw new InternalServerErrorException('Payment gateway not configured');
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('Razorpay Fetch Payment Error:', error);
      throw new InternalServerErrorException('Failed to fetch payment details');
    }
  }

  async refundPayment(paymentId: string, amount: number, notes: any = {}) {
    if (!this.razorpay)
      throw new InternalServerErrorException('Payment gateway not configured');

    try {
      // Razorpay amount is in paise
      return await this.razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100),
        notes,
      });
    } catch (error) {
      console.error('Razorpay Refund Error:', error);
      throw new InternalServerErrorException(
        'Failed to process refund with gateway',
      );
    }
  }
}
