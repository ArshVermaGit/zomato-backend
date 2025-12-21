import type { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';
export declare class JobsService {
    private orderQueue;
    private notificationQueue;
    private analyticsQueue;
    private paymentQueue;
    private prisma;
    private readonly logger;
    constructor(orderQueue: Queue, notificationQueue: Queue, analyticsQueue: Queue, paymentQueue: Queue, prisma: PrismaService);
    triggerOrderMaintenance(): any;
    triggerDailyNotifications(): any;
    triggerMidnightJobs(): any;
    private cleanupData;
}
