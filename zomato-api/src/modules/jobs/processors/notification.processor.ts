import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { NotificationsService } from '../../notifications/notifications.service';

@Processor('notifications')
export class NotificationJobsProcessor {
  private readonly logger = new Logger(NotificationJobsProcessor.name);

  constructor(private notificationsService: NotificationsService) {}

  @Process('sendDailySummary')
  sendDailySummary(_job: Job) {
    this.logger.log('Sending daily summary to partners...');
    // Logic: specific service call to broadcast summary
    // await this.notificationsService.broadcastToRole('DELIVERY_PARTNER', 'Daily Update', '...');
  }

  @Process('retryFailed')
  retryFailed(_job: Job) {
    // Logic to retry failed notifications
  }
}
