import { AnalyticsService } from './analytics.service';
import { ReportGenerationService } from './report-generation.service';
import { ReportType } from '@prisma/client';
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly reportService;
    constructor(analyticsService: AnalyticsService, reportService: ReportGenerationService);
    getDashboard(): unknown;
    getOrders(range: 'daily' | 'weekly' | 'monthly'): unknown;
    getRevenue(range: 'daily' | 'weekly' | 'monthly'): unknown;
    generateReport(req: any, body: {
        type: ReportType;
        criteria?: any;
    }): unknown;
    getReport(id: string): unknown;
}
