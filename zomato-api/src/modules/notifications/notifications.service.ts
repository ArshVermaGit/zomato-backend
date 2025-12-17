import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectQueue('notifications') private notificationsQueue: Queue,
        private prisma: PrismaService
    ) { }

    async sendNotification(
        userId: string,
        title: string,
        message: string,
        type: NotificationType,
        channels: string[] = ['IN_APP']
    ) {
        // 1. Create In-App Notification
        if (channels.includes('IN_APP')) {
            await this.prisma.notification.create({
                data: {
                    userId,
                    title,
                    message, // Changed from body
                    type,
                    data: { channels } // Store channels in data json
                }
            });
        }

        // 2. Add Job to Queue for External Channels
        await this.notificationsQueue.add('send_notification', {
            userId,
            title,
            message,
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
        // fcmTokens not in schema, ignoring for now or could store in generic data field
        console.log(`Registering device for ${userId}: ${token}`);
        return { success: true };
    }
}
