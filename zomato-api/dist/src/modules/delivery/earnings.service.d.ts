import { PrismaService } from '../../database/prisma.service';
import { TransactionType, TransactionCategory } from '@prisma/client';
export declare class EarningsService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(partnerId: string, amount: number, type: TransactionType, category: TransactionCategory, description: string, referenceId?: string): Promise<{
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        partnerId: string;
        category: import("@prisma/client").$Enums.TransactionCategory;
        amount: import("@prisma/client-runtime-utils").Decimal;
        referenceId: string | null;
    }>;
    calculateOrderEarnings(distanceKm: number, orderTotal: number): number;
    getBalance(userId: string): Promise<{
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
    }>;
    requestPayout(userId: string, amount: number): Promise<{
        method: string | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        partnerId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        processedAt: Date | null;
    }>;
    getTransactions(userId: string): Promise<{
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        partnerId: string;
        category: import("@prisma/client").$Enums.TransactionCategory;
        amount: import("@prisma/client-runtime-utils").Decimal;
        referenceId: string | null;
    }[]>;
    getPayoutHistory(userId: string): Promise<{
        method: string | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        partnerId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        processedAt: Date | null;
    }[]>;
    getPerformanceMetrics(userId: string): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
