import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WalletTransactionType, PayoutStatus, Prisma } from '@prisma/client';

@Injectable()
export class EarningsService {
  constructor(private prisma: PrismaService) {}

  // --- LEDGER LOGIC ---

  async addTransaction(
    partnerId: string,
    amount: number,
    type: WalletTransactionType,
    description: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Transaction Record
      const transaction = await tx.walletTransaction.create({
        data: {
          deliveryPartnerId: partnerId,
          amount: new Prisma.Decimal(amount),
          type,
          description,
        },
      });

      // 2. Update Balance atomically
      const increment =
        type === WalletTransactionType.CREDIT ? amount : -amount;
      await tx.deliveryPartner.update({
        where: { id: partnerId },
        data: {
          availableBalance: { increment }, // Schema uses availableBalance
          totalEarnings:
            type === WalletTransactionType.CREDIT
              ? { increment: amount }
              : undefined,
        },
      });

      return transaction;
    });
  }

  // --- EARNINGS CALCULATION & PROCESSING ---

  async processOrderEarnings(
    deliveryPartnerId: string,
    orderId: string,
    orderNumber: string,
    deliveryFee: number,
    tip: number,
    distanceKm: number = 2, // Default or passed
  ) {
    // 1. Calculate Earnings
    const BASE_PAY = 30;
    const PER_KM_RATE = 10;
    const DISTANCE_PAY = distanceKm * PER_KM_RATE;
    const _CHECKOUT_EARNING = Number(deliveryFee) * 0.8; // Fallback or explicit

    // Strategy: Use calculated distance pay, but ensure at least 80% of delivery fee is given?
    // Or just explicit formula: Base + Distance.
    // Let's use the explicit Hybrid model as per best practices:
    // Earning = Max(Base + Distance, 80% Delivery Fee) ?
    // For simplicity reusing user's existing logic but enhancing it:
    // We will pay them the Calculated Amount (Base + Distance) plus the Tip.

    let earningAmount = BASE_PAY + DISTANCE_PAY;

    // Incentive: Peak hour? (Mock check)
    const isPeakHour =
      new Date().getHours() >= 19 && new Date().getHours() <= 21;
    if (isPeakHour) {
      earningAmount += 20; // Peak bonus
    }

    // 2. Transactional Update
    return this.prisma.$transaction(async (tx) => {
      // A. Record Delivery Fee Earning
      await tx.earning.create({
        data: {
          deliveryPartnerId,
          orderId,
          type: 'DELIVERY_FEE', // Enum EarningType.DELIVERY_FEE
          amount: new Prisma.Decimal(earningAmount),
          description: `Earnings for order #${orderNumber} (${distanceKm}km)`,
        },
      });

      // B. Record Tip Earning
      if (tip > 0) {
        await tx.earning.create({
          data: {
            deliveryPartnerId,
            orderId,
            type: 'TIP', // Enum EarningType.TIP
            amount: new Prisma.Decimal(tip),
            description: `Tip for order #${orderNumber}`,
          },
        });
      }

      // C. Update Wallet Balance
      const totalCredit = earningAmount + tip;
      await tx.deliveryPartner.update({
        where: { id: deliveryPartnerId },
        data: {
          totalEarnings: { increment: totalCredit },
          availableBalance: { increment: totalCredit },
        },
      });

      // D. Ledger Entry (Summary)
      await tx.walletTransaction.create({
        data: {
          deliveryPartnerId,
          amount: new Prisma.Decimal(totalCredit),
          type: WalletTransactionType.CREDIT,
          description: `Order #${orderNumber} Earnings`,
        },
      });

      return { earningAmount, tip, total: totalCredit };
    });
  }

  // --- PAYOUT LOGIC ---

  async getBalance(userId: string) {
    const partner = await this.prisma.deliveryPartner.findUnique({
      where: { userId },
    });
    if (!partner) throw new NotFoundException('Partner not found');
    return {
      currentBalance: partner.availableBalance,
      totalEarnings: partner.totalEarnings,
    };
  }

  async requestPayout(userId: string, amount: number) {
    const partner = await this.prisma.deliveryPartner.findUnique({
      where: { userId },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    const balance = Number(partner.availableBalance);
    if (balance < amount) {
      throw new BadRequestException(
        `Insufficient balance. Current: ${balance}, Requested: ${amount}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Deduct Balance immediately (Reserve funds)
      await tx.deliveryPartner.update({
        where: { id: partner.id },
        data: { availableBalance: { decrement: amount } },
      });

      // 2. Create Payout Request
      const payout = await tx.payoutRequest.create({
        data: {
          deliveryPartnerId: partner.id,
          amount: new Prisma.Decimal(amount),
          status: PayoutStatus.PENDING,
          // method: 'UPI' // removed as per schema
        },
      });

      // 3. Log into Ledger as Debit
      await tx.walletTransaction.create({
        data: {
          deliveryPartnerId: partner.id,
          amount: new Prisma.Decimal(amount),
          type: WalletTransactionType.DEBIT,
          description: `Payout Request ${payout.id}`,
        },
      });

      return payout;
    });
  }

  async createWalletTransaction(
    deliveryPartnerId: string,
    amount: number,
    type: 'CREDIT' | 'DEBIT',
    description?: string,
  ) {
    const partner = await this.prisma.deliveryPartner.findUnique({
      where: { id: deliveryPartnerId },
    });
    if (!partner) throw new NotFoundException('Delivery partner not found');

    // Map string type to Enum
    const txnType =
      type === 'CREDIT'
        ? WalletTransactionType.CREDIT
        : WalletTransactionType.DEBIT;

    return this.prisma.walletTransaction.create({
      data: {
        deliveryPartnerId: partner.id,
        amount: new Prisma.Decimal(amount),
        type: txnType,
        description,
      },
    });
  }

  async getHistory(userId: string) {
    const partner = await this.prisma.deliveryPartner.findUnique({
      where: { userId },
    });

    if (!partner) throw new NotFoundException('Delivery partner not found');

    return this.prisma.walletTransaction.findMany({
      where: { deliveryPartnerId: partner.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayoutRequests(userId: string) {
    const partner = await this.prisma.deliveryPartner.findUnique({
      where: { userId },
    });
    if (!partner) throw new NotFoundException('Delivery partner not found');

    return this.prisma.payoutRequest.findMany({
      where: { deliveryPartnerId: partner.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ...

  async getStats(userId: string) {
    const partner = await this.prisma.deliveryPartner.findUnique({
      where: { userId },
      include: {
        orders: {
          where: { status: 'DELIVERED' },
          select: { deliveredAt: true }, // removed createdAt as usage mock logic only needed one
        },
      },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    // Calculate simple metrics
    const totalDeliveries = partner.totalDeliveries;
    const rating = Number(partner.rating);

    return {
      totalDeliveries,
      averageRating: rating,
      acceptanceRate: 95, // Mock for MVP
      onTimeRate: 98, // Mock for MVP
      lifetimeEarnings: partner.totalEarnings,
    };
  }
}
