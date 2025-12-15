import { Job } from 'bull';
import { AnalyticsService } from '../../analytics/analytics.service';
export declare class AnalyticsJobsProcessor {
    private analyticsService;
    private readonly logger;
    constructor(analyticsService: AnalyticsService);
    calculateDailyMetrics(job: Job): Promise<void>;
}
