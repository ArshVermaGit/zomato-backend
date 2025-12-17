import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    registerDevice(req: any, token: string): unknown;
    getUserNotifications(req: any): unknown;
    markAsRead(id: string): unknown;
}
