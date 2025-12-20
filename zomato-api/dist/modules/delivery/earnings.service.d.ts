import { PrismaService } from '../../database/prisma.service';
import { WalletTransactionType, Prisma } from '@prisma/client';
export declare class EarningsService {
    private prisma;
    constructor(prisma: PrismaService);
    addTransaction(partnerId: string, amount: number, type: WalletTransactionType, description: string): Promise<{
        id: string;
        amount: Prisma.Decimal;
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        createdAt: Date;
        deliveryPartnerId: string;
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
        amount: Prisma.Decimal;
        createdAt: Date;
        deliveryPartnerId: string;
        status: import(".prisma/client").$Enums.PayoutStatus;
        processedAt: Date | null;
        referenceId: string | null;
        updatedAt: Date;
    }>;
    createWalletTransaction(deliveryPartnerId: string, amount: number, type: 'CREDIT' | 'DEBIT', description?: string): Promise<{
        id: string;
        amount: Prisma.Decimal;
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        createdAt: Date;
        deliveryPartnerId: string;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        amount: Prisma.Decimal;
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        createdAt: Date;
        deliveryPartnerId: string;
    }[]>;
    getPayoutRequests(userId: string): Promise<{
        id: string;
        amount: Prisma.Decimal;
        createdAt: Date;
        deliveryPartnerId: string;
        status: import(".prisma/client").$Enums.PayoutStatus;
        processedAt: Date | null;
        referenceId: string | null;
        updatedAt: Date;
    }[]>;
    getStats(userId: string): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: Prisma.Decimal;
    }>;
}
