import type { Job } from 'bull';
import { PrismaService } from '../../../database/prisma.service';
export declare class OrderJobsProcessor {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleAutoCancel(_job: Job): Promise<void>;
    monitorStuckOrders(_job: Job): Promise<void>;
    handleAssignment(job: Job<{
        orderId: string;
    }>): void;
}
