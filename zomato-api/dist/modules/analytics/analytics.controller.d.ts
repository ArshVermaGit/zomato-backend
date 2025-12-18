import { AnalyticsService } from './analytics.service';
import { ReportGenerationService } from './report-generation.service';
import { ReportType } from '@prisma/client';
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly reportService;
    constructor(analyticsService: AnalyticsService, reportService: ReportGenerationService);
    getDashboard(): Promise<{
        orders: {
            total: number;
            today: number;
        };
        revenue: {
            total: number | import("@prisma/client/runtime/library").Decimal;
            today: number | import("@prisma/client/runtime/library").Decimal;
        };
        users: {
            activeCustomers: number;
            activePartners: number;
        };
    }>;
    getOrders(range: 'daily' | 'weekly' | 'monthly'): Promise<{
        range: "daily" | "weekly" | "monthly";
        total: number;
        byStatus: {
            status: import(".prisma/client").$Enums.OrderStatus;
            count: number;
        }[];
        peakHours: {
            hour: number;
            count: any;
        }[];
    }>;
    getRevenue(range: 'daily' | 'weekly' | 'monthly'): Promise<{
        range: "daily" | "weekly" | "monthly";
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        breakdown: {
            deliveryFees: number | import("@prisma/client/runtime/library").Decimal;
            platformFees: number | import("@prisma/client/runtime/library").Decimal;
            taxes: number | import("@prisma/client/runtime/library").Decimal;
            tips: number | import("@prisma/client/runtime/library").Decimal;
            netRevenue: number;
        };
        topRestaurants: {
            restaurant: string;
            revenue: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    }>;
    generateReport(req: any, body: {
        type: ReportType;
        criteria?: any;
    }): Promise<{
        url: string | null;
        data: import("@prisma/client/runtime/library").JsonValue;
        type: import(".prisma/client").$Enums.ReportType;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        period: string;
        generatedBy: string | null;
    }>;
    getReport(id: string): Promise<{
        url: string | null;
        data: import("@prisma/client/runtime/library").JsonValue;
        type: import(".prisma/client").$Enums.ReportType;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        period: string;
        generatedBy: string | null;
    } | null>;
}
