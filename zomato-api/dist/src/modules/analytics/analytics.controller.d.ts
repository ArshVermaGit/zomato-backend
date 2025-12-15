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
            total: number | import("@prisma/client-runtime-utils").Decimal;
            today: number | import("@prisma/client-runtime-utils").Decimal;
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
            status: import("@prisma/client").$Enums.OrderStatus;
            count: number;
        }[];
        peakHours: {
            hour: number;
            count: any;
        }[];
    }>;
    getRevenue(range: 'daily' | 'weekly' | 'monthly'): Promise<{
        range: "daily" | "weekly" | "monthly";
        totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        breakdown: {
            deliveryFees: number | import("@prisma/client-runtime-utils").Decimal;
            platformFees: number | import("@prisma/client-runtime-utils").Decimal;
            taxes: number | import("@prisma/client-runtime-utils").Decimal;
            tips: number | import("@prisma/client-runtime-utils").Decimal;
            netRevenue: number;
        };
        topRestaurants: {
            restaurant: string;
            revenue: import("@prisma/client-runtime-utils").Decimal | null;
        }[];
    }>;
    generateReport(req: any, body: {
        type: ReportType;
        criteria?: any;
    }): Promise<{
        url: string | null;
        type: import("@prisma/client").$Enums.ReportType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReportStatus;
        generatedBy: string;
        criteria: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getReport(id: string): Promise<{
        url: string | null;
        type: import("@prisma/client").$Enums.ReportType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReportStatus;
        generatedBy: string;
        criteria: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
}
