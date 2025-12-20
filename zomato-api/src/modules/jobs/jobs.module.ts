import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { OrderJobsProcessor } from './processors/order.processor';
import { NotificationJobsProcessor } from './processors/notification.processor';
import { AnalyticsJobsProcessor } from './processors/analytics.processor';
import { PaymentJobsProcessor } from './processors/payment.processor';
import { PrismaService } from '../../database/prisma.service';
import { OrdersModule } from '../orders/orders.module'; // Import feature modules as needed for logic reuse
import { NotificationsModule } from '../notifications/notifications.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue(
      { name: 'orders' },
      { name: 'notifications' },
      { name: 'analytics' },
      { name: 'payments' },
    ),
    OrdersModule,
    NotificationsModule,
    AnalyticsModule,
    PaymentsModule,
  ],
  providers: [
    JobsService,
    OrderJobsProcessor,
    NotificationJobsProcessor,
    AnalyticsJobsProcessor,
    PaymentJobsProcessor,
    PrismaService,
  ],
})
export class JobsModule {}
