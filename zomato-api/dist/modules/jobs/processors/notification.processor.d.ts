import type { Job } from 'bull';
import { NotificationsService } from '../../notifications/notifications.service';
export declare class NotificationJobsProcessor {
    private notificationsService;
    private readonly logger;
    constructor(notificationsService: NotificationsService);
    sendDailySummary(_job: Job): void;
    retryFailed(_job: Job): void;
}
