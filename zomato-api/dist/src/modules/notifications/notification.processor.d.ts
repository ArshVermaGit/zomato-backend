import type { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { FirebaseService } from './firebase.service';
import { TwilioService } from './twilio.service';
import { SendGridService } from './sendgrid.service';
export declare class NotificationProcessor {
    private prisma;
    private firebase;
    private twilio;
    private sendGrid;
    constructor(prisma: PrismaService, firebase: FirebaseService, twilio: TwilioService, sendGrid: SendGridService);
    handleNotification(job: Job): Promise<void>;
}
