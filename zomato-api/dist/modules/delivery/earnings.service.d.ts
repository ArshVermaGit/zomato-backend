import { PrismaService } from '../../database/prisma.service';
import { WalletTransactionType } from '@prisma/client';
export declare class EarningsService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(partnerId: string, amount: number, type: WalletTransactionType, description: string): Promise<any>;
    processOrderEarnings(deliveryPartnerId: string, orderId: string, orderNumber: string, deliveryFee: number, tip: number, distanceKm?: number): Promise<any>;
    getBalance(userId: string): Promise<{
        currentBalance: any;
        totalEarnings: any;
    }>;
    requestPayout(userId: string, amount: number): Promise<any>;
    createWalletTransaction(deliveryPartnerId: string, amount: number, type: 'CREDIT' | 'DEBIT', description?: string): Promise<any>;
    getHistory(userId: string): Promise<any>;
    getPayoutRequests(userId: string): Promise<any>;
    getStats(userId: string): Promise<{
        totalDeliveries: any;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: any;
    }>;
}
