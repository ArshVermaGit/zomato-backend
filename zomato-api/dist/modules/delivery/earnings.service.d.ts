import { PrismaService } from '../../database/prisma.service';
import { WalletTransactionType } from '@prisma/client';
export declare class EarningsService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(partnerId: string, amount: number, type: WalletTransactionType, description: string): unknown;
    calculateOrderEarnings(distanceKm: number, orderTotal: number): number;
    getBalance(userId: string): unknown;
    requestPayout(userId: string, amount: number): unknown;
    createWalletTransaction(deliveryPartnerId: string, amount: number, type: 'CREDIT' | 'DEBIT', description?: string): unknown;
    getHistory(userId: string): unknown;
    getPayoutRequests(userId: string): unknown;
    getStats(userId: string): unknown;
}
