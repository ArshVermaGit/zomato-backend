import { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';
export declare class JobsService {
    private orderQueue;
    private notificationQueue;
    private analyticsQueue;
    private paymentQueue;
    private prisma;
    private readonly logger;
    constructor(orderQueue: Queue, notificationQueue: Queue, analyticsQueue: Queue, paymentQueue: Queue, prisma: PrismaService);
    triggerOrderMaintenance(): Promise<void>;
    triggerDailyNotifications(): Promise<void>;
    triggerMidnightJobs(): Promise<void>;
    private cleanupData;
}
