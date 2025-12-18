import { NotificationsService } from './notifications.service';
import type { Request } from 'express';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    registerToken(req: Request, body: {
        token: string;
    }): Promise<{
        success: boolean;
    }>;
}
