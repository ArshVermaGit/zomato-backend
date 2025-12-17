import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { AnalyticsService } from '../../analytics/analytics.service';

@Processor('analytics')
export class AnalyticsJobsProcessor {
    private readonly logger = new Logger(AnalyticsJobsProcessor.name);

    constructor(private analyticsService: AnalyticsService) { }

    @Process('calculateDailyMetrics')
    async calculateDailyMetrics(job: Job) {
        this.logger.log('Calculating Daily Analytics Metrics...');
        // Logic to pre-calculate and cache daily metrics to speed up dashboard loading
        // For example, store result in Redis
        // await this.analyticsService.cacheDailyMetrics();
    }
}
