import type { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsService {
    private notificationsQueue;
    private prisma;
    constructor(notificationsQueue: Queue, prisma: PrismaService);
    sendNotification(userId: string, title: string, message: string, type: NotificationType, channels?: string[]): unknown;
    getUserNotifications(userId: string): unknown;
    markAsRead(id: string): unknown;
    registerDevice(userId: string, token: string): unknown;
}
