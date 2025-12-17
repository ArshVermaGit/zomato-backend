import { PrismaService } from '../../database/prisma.service';
import { TransactionType, TransactionCategory } from '@prisma/client';
export declare class EarningsService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(partnerId: string, amount: number, type: TransactionType, category: TransactionCategory, description: string, referenceId?: string): Promise<any>;
    calculateOrderEarnings(distanceKm: number, orderTotal: number): number;
    getBalance(userId: string): Promise<{
        currentBalance: any;
        totalEarnings: any;
    }>;
    requestPayout(userId: string, amount: number): Promise<any>;
    getTransactions(userId: string): Promise<any>;
    getPayoutHistory(userId: string): Promise<any>;
    getPerformanceMetrics(userId: string): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: any;
    }>;
}
