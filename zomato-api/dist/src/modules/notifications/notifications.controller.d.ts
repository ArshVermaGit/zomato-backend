import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    registerDevice(req: any, token: string): Promise<void>;
    getUserNotifications(req: any): Promise<{
        data: import("@prisma/client/runtime/client").JsonValue | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        data: import("@prisma/client/runtime/client").JsonValue | null;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        isRead: boolean;
    }>;
}
