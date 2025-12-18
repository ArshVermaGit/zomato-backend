import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';
import { DatabaseModule } from '../../database/database.module';
import { FirebaseService } from './firebase.service';
import { TwilioService } from './twilio.service';
import { SendGridService } from './sendgrid.service';
@Module({
    imports: [
        DatabaseModule,
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    controllers: [NotificationsController],
    providers: [
        NotificationsService,
        NotificationProcessor,
        FirebaseService,
        TwilioService,
        SendGridService
    ],
    exports: [NotificationsService],
})
export class NotificationsModule { }
