import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TransactionType, TransactionCategory, PayoutStatus } from '@prisma/client';

@Injectable()
export class EarningsService {
    constructor(private prisma: PrismaService) { }

    // --- LEDGER LOGIC ---

    async addTransaction(partnerId: string, amount: number, type: TransactionType, category: TransactionCategory, description: string, referenceId?: string) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Transaction Record
            const transaction = await tx.walletTransaction.create({
                data: {
                    partnerId,
                    amount,
                    type,
                    category,
                    description,
                    referenceId
                }
            });

            // 2. Update Balance atomically
            const increment = type === TransactionType.CREDIT ? amount : -amount;
            await tx.deliveryPartner.update({
                where: { id: partnerId }, // Relation is via ID not UserID usually, let's verify usage.
                // Note: method signature should probably take partnerId (UUID) not userId.
                // We'll enforce partnerId usage.
                data: {
                    currentBalance: { increment },
                    earnings: type === TransactionType.CREDIT ? { increment: amount } : undefined // Track total lifetime earnings
                }
            });

            return transaction;
        });
    }

    // --- EARNINGS CALCULATION ---

    calculateOrderEarnings(distanceKm: number, orderTotal: number) {
        // Logic: Setup base fee + distance bonus
        const BASE_FEE = 30; // ₹30 base
        const PER_KM_RATE = 10; // ₹10/km
        const distanceFee = distanceKm * PER_KM_RATE;

        // Incentives (stubbed)
        // e.g. if orderTotal > 1000, bonus 20?

        return BASE_FEE + distanceFee;
    }

    // --- PAYOUT LOGIC ---

    async getBalance(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner not found');
        return {
            currentBalance: partner.currentBalance,
            totalEarnings: partner.earnings
        };
    }

    async requestPayout(userId: string, amount: number) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner not found');

        const balance = Number(partner.currentBalance);
        if (balance < amount) {
            throw new BadRequestException(`Insufficient balance. Current: ${balance}, Requested: ${amount}`);
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Deduct Balance immediately (Reserve funds)
            await tx.deliveryPartner.update({
                where: { id: partner.id },
                data: { currentBalance: { decrement: amount } }
            });

            // 2. Create Payout Request
            const payout = await tx.payoutRequest.create({
                data: {
                    partnerId: partner.id,
                    amount,
                    status: PayoutStatus.PENDING,
                    method: 'UPI' // Default for MVP
                }
            });

            // 3. Log into Ledger as Debit (Category: PAYOUT)
            await tx.walletTransaction.create({
                data: {
                    partnerId: partner.id,
                    amount,
                    type: TransactionType.DEBIT,
                    category: TransactionCategory.PAYOUT,
                    description: `Payout Request ${payout.id}`,
                    referenceId: payout.id
                }
            });

            return payout;
        });
    }

    async getTransactions(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner not found');

        return this.prisma.walletTransaction.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPayoutHistory(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner not found');

        return this.prisma.payoutRequest.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPerformanceMetrics(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
            include: {
                orders: {
                    where: { status: 'DELIVERED' },
                    select: { createdAt: true, deliveredAt: true }
                }
            }
        });
        if (!partner) throw new NotFoundException('Partner not found');

        // Calculate simple metrics
        const totalDeliveries = partner.totalDeliveries;
        const rating = Number(partner.rating);

        // Calculate average delivery time (mock logic using dates)
        // For real impl, we'd diff deliveredAt and pickedUpAt

        return {
            totalDeliveries,
            averageRating: rating,
            acceptanceRate: 95, // Mock for MVP: we don't track rejections per partner yet
            onTimeRate: 98,    // Mock for MVP
            lifetimeEarnings: partner.earnings
        };
    }
}
