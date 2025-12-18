import type { Job } from 'bull';
import { NotificationsService } from '../../notifications/notifications.service';
export declare class NotificationJobsProcessor {
    private notificationsService;
    private readonly logger;
    constructor(notificationsService: NotificationsService);
    sendDailySummary(job: Job): Promise<void>;
    retryFailed(job: Job): Promise<void>;
}
