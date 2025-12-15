import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    registerDevice(req: any, token: string): Promise<void>;
    getUserNotifications(req: any): Promise<{
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
}
