import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { FirebaseService } from './firebase.service';
import { TwilioService } from './twilio.service';
import { SendGridService } from './sendgrid.service';

@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
    private twilio: TwilioService,
    private sendGrid: SendGridService,
  ) {}

  @Process('send_notification')
  async handleNotification(job: Job) {
    const { userId, title, body, channels } = job.data;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // Check preferences here if implemented (e.g. user.notificationPreferences)

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'PUSH':
            if (user.fcmTokens && user.fcmTokens.length > 0) {
              // Send to all tokens
              for (const token of user.fcmTokens) {
                this.firebase.sendPushNotification(token, title, body);
              }
            }
            break;
          case 'SMS':
            if (user.phone) {
              this.twilio.sendSms(user.phone, `${title}: ${body}`);
            }
            break;
          case 'EMAIL':
            if (user.email) {
              this.sendGrid.sendEmail(user.email, title, body);
            }
            break;
        }
      } catch (err) {
        console.error(
          `Failed to send ${channel} notification to user ${userId}`,
          err,
        );
      }
    }
  }
}
