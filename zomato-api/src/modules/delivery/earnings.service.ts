import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WalletTransactionType, PayoutStatus, Prisma, PayoutMethod } from '@prisma/client';

@Injectable()
export class EarningsService {
    constructor(private prisma: PrismaService) { }

    // --- LEDGER LOGIC ---

    async addTransaction(partnerId: string, amount: number, type: WalletTransactionType, description: string) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Transaction Record
            const transaction = await tx.walletTransaction.create({
                data: {
                    deliveryPartnerId: partnerId,
                    amount: new Prisma.Decimal(amount),
                    type,
                    description
                }
            });

            // 2. Update Balance atomically
            const increment = type === WalletTransactionType.CREDIT ? amount : -amount;
            await tx.deliveryPartner.update({
                where: { id: partnerId },
                data: {
                    availableBalance: { increment }, // Schema uses availableBalance
                    totalEarnings: type === WalletTransactionType.CREDIT ? { increment: amount } : undefined
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
            currentBalance: partner.availableBalance,
            totalEarnings: partner.totalEarnings
        };
    }

    async requestPayout(userId: string, amount: number) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner not found');

        const balance = Number(partner.availableBalance);
        if (balance < amount) {
            throw new BadRequestException(`Insufficient balance. Current: ${balance}, Requested: ${amount}`);
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Deduct Balance immediately (Reserve funds)
            await tx.deliveryPartner.update({
                where: { id: partner.id },
                data: { availableBalance: { decrement: amount } }
            });

            // 2. Create Payout Request
            const payout = await tx.payoutRequest.create({
                data: {
                    deliveryPartnerId: partner.id,
                    amount: new Prisma.Decimal(amount),
                    status: PayoutStatus.PENDING,
                    // method: 'UPI' // removed as per schema
                }
            });

            // 3. Log into Ledger as Debit
            await tx.walletTransaction.create({
                data: {
                    deliveryPartnerId: partner.id,
                    amount: new Prisma.Decimal(amount),
                    type: WalletTransactionType.DEBIT,
                    description: `Payout Request ${payout.id}`
                }
            });

            return payout;
        });
    }

    async createWalletTransaction(deliveryPartnerId: string, amount: number, type: 'CREDIT' | 'DEBIT', description?: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { id: deliveryPartnerId } });
        if (!partner) throw new NotFoundException('Delivery partner not found');

        // Map string type to Enum
        const txnType = type === 'CREDIT' ? WalletTransactionType.CREDIT : WalletTransactionType.DEBIT;

        return this.prisma.walletTransaction.create({
            data: {
                deliveryPartnerId: partner.id,
                amount: new Prisma.Decimal(amount),
                type: txnType,
                description,
            }
        });
    }

    async getHistory(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
        });

        if (!partner) throw new NotFoundException('Delivery partner not found');

        return this.prisma.walletTransaction.findMany({
            where: { deliveryPartnerId: partner.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getPayoutRequests(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Delivery partner not found');

        return this.prisma.payoutRequest.findMany({
            where: { deliveryPartnerId: partner.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    // ...

    async getStats(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
            include: {
                orders: {
                    where: { status: 'DELIVERED' },
                    select: { deliveredAt: true } // removed createdAt as usage mock logic only needed one
                }
            }
        });
        if (!partner) throw new NotFoundException('Partner not found');

        // Calculate simple metrics
        const totalDeliveries = partner.totalDeliveries;
        const rating = Number(partner.rating);

        return {
            totalDeliveries,
            averageRating: rating,
            acceptanceRate: 95, // Mock for MVP
            onTimeRate: 98,    // Mock for MVP
            lifetimeEarnings: partner.totalEarnings
        };
    }
}
