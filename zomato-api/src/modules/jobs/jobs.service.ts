import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(
        @InjectQueue('orders') private orderQueue: Queue,
        @InjectQueue('notifications') private notificationQueue: Queue,
        @InjectQueue('analytics') private analyticsQueue: Queue,
        @InjectQueue('payments') private paymentQueue: Queue,
        private prisma: PrismaService,
    ) { }

    // --- CRON JOBS ---

    // Every minute: auto-cancel unpaid orders
    @Cron(CronExpression.EVERY_MINUTE)
    async triggerOrderMaintenance() {
        this.logger.debug('Triggering Order Maintenance Job');
        await this.orderQueue.add('autoCancelUnpaid', {}, { attempts: 3 });
        await this.orderQueue.add('monitorStuckOrders', {}, { removeOnComplete: true });
    }

    // Daily 8:00 AM: Partner Summary
    @Cron('0 8 * * *')
    async triggerDailyNotifications() {
        this.logger.debug('Triggering Daily Partner Summary');
        await this.notificationQueue.add('sendDailySummary', {});
    }

    // Daily Midnight: Analytics & Payouts
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async triggerMidnightJobs() {
        this.logger.debug('Triggering Midnight Analytics & Payouts');
        await this.analyticsQueue.add('calculateDailyMetrics', {});
        await this.paymentQueue.add('processPayouts', {});
        await this.cleanupData();
    }

    // --- CLEANUP ---
    private async cleanupData() {
        this.logger.log('Running daily cleanup...');
        // Example: Delete OTPs older than 24 hours (if stored in DB, otherwise Redis handles expiry)
        // For MVP, archive orders older than 1 year (example logic)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Just log for now
        this.logger.log(`Scanning for orders older than ${oneYearAgo.toISOString()}`);
    }
}
