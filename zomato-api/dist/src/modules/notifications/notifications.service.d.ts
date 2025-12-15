import type { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';
export declare class NotificationsService {
    private notificationsQueue;
    private prisma;
    constructor(notificationsQueue: Queue, prisma: PrismaService);
    sendNotification(userId: string, title: string, body: string, type: NotificationType, channels?: NotificationChannel[]): Promise<{
        success: boolean;
    }>;
    getUserNotifications(userId: string): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        body: string;
        channel: import("@prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        body: string;
        channel: import("@prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
    }>;
    registerDevice(userId: string, token: string): Promise<void>;
}
