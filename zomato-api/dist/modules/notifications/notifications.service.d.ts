import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    sendPushNotification(userId: string, notification: {
        title: string;
        body: string;
        data?: any;
    }): Promise<void>;
    sendBulkNotifications(userIds: string[], notification: {
        title: string;
        body: string;
        data?: any;
    }): Promise<void>;
    registerFCMToken(userId: string, token: string): Promise<void>;
    private removeInvalidTokens;
    sendNotification(userId: string, title: string, message: string, type: NotificationType, channels?: string[]): Promise<{
        success: boolean;
    }>;
}
