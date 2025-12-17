import { PrismaService } from '../../database/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardMetrics(): unknown;
    getOrderAnalytics(range?: 'daily' | 'weekly' | 'monthly'): unknown;
    getRevenueAnalytics(range?: 'daily' | 'weekly' | 'monthly'): unknown;
    private getStartDate;
}
