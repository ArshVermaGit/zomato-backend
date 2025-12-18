import { PrismaService } from '../../database/prisma.service';
import { WalletTransactionType, Prisma } from '@prisma/client';
export declare class EarningsService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(partnerId: string, amount: number, type: WalletTransactionType, description: string): Promise<{
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        deliveryPartnerId: string;
        amount: Prisma.Decimal;
    }>;
    processOrderEarnings(deliveryPartnerId: string, orderId: string, orderNumber: string, deliveryFee: number, tip: number, distanceKm?: number): Promise<{
        earningAmount: number;
        tip: number;
        total: number;
    }>;
    getBalance(userId: string): Promise<{
        currentBalance: Prisma.Decimal;
        totalEarnings: Prisma.Decimal;
    }>;
    requestPayout(userId: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        deliveryPartnerId: string;
        amount: Prisma.Decimal;
        processedAt: Date | null;
        referenceId: string | null;
    }>;
    createWalletTransaction(deliveryPartnerId: string, amount: number, type: 'CREDIT' | 'DEBIT', description?: string): Promise<{
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        deliveryPartnerId: string;
        amount: Prisma.Decimal;
    }>;
    getHistory(userId: string): Promise<{
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        deliveryPartnerId: string;
        amount: Prisma.Decimal;
    }[]>;
    getPayoutRequests(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        deliveryPartnerId: string;
        amount: Prisma.Decimal;
        processedAt: Date | null;
        referenceId: string | null;
    }[]>;
    getStats(userId: string): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: Prisma.Decimal;
    }>;
}
