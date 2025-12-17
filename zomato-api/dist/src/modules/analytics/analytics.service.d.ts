import { PrismaService } from '../../database/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardMetrics(): Promise<{
        orders: {
            total: number;
            today: number;
        };
        revenue: {
            total: number | import("@prisma/client-runtime-utils").Decimal;
            today: number | import("@prisma/client-runtime-utils").Decimal;
        };
        users: {
            activeCustomers: number;
            activePartners: number;
        };
    }>;
    getOrderAnalytics(range?: 'daily' | 'weekly' | 'monthly'): Promise<{
        range: "daily" | "weekly" | "monthly";
        total: number;
        byStatus: {
            status: import("@prisma/client").$Enums.OrderStatus;
            count: number;
        }[];
        peakHours: {
            hour: number;
            count: any;
        }[];
    }>;
    getRevenueAnalytics(range?: 'daily' | 'weekly' | 'monthly'): Promise<{
        range: "daily" | "weekly" | "monthly";
        totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        breakdown: {
            deliveryFees: number | import("@prisma/client-runtime-utils").Decimal;
            platformFees: any;
            taxes: number | import("@prisma/client-runtime-utils").Decimal;
            tips: number | import("@prisma/client-runtime-utils").Decimal;
            netRevenue: number;
        };
        topRestaurants: {
            restaurant: string;
            revenue: import("@prisma/client-runtime-utils").Decimal | null;
        }[];
    }>;
    private getStartDate;
}
