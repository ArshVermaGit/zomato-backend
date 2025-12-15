import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectQueue('notifications') private notificationsQueue: Queue,
        private prisma: PrismaService
    ) { }

    async sendNotification(
        userId: string,
        title: string,
        body: string,
        type: NotificationType,
        channels: NotificationChannel[] = ['IN_APP']
    ) {
        // 1. Create In-App Notification (always, or based on channel)
        if (channels.includes('IN_APP')) {
            await this.prisma.notification.create({
                data: {
                    userId,
                    title,
                    body,
                    type,
                    channel: 'IN_APP',
                }
            });
        }

        // 2. Add Job to Queue for External Channels
        await this.notificationsQueue.add('send_notification', {
            userId,
            title,
            body,
            type,
            channels: channels.filter(c => c !== 'IN_APP')
        }, {
            attempts: 3,
            backoff: 1000,
            removeOnComplete: true
        });

        return { success: true };
    }

    async getUserNotifications(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(id: string) {
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async registerDevice(userId: string, token: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            const tokens = new Set(user.fcmTokens || []);
            tokens.add(token);
            await this.prisma.user.update({
                where: { id: userId },
                data: { fcmTokens: Array.from(tokens) }
            });
        }
    }
}
