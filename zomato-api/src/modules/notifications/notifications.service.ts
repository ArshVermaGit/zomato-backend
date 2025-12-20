import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      } catch (error) {
        console.warn('Firebase init failed (likely missing env vars):', error);
      }
    }
  }

  // Send push notification
  async sendPushNotification(
    userId: string,
    notification: {
      title: string;
      body: string;
      data?: any;
    },
  ) {
    // Get user's FCM tokens (Array)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true },
    });

    if (!user?.fcmTokens || user.fcmTokens.length === 0) {
      console.log(`No FCM tokens for user ${userId}`);
      return;
    }

    // Send notification to all tokens
    // Note: Multicast is better for multiple tokens
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens: user.fcmTokens,
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          channelId: 'orders',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const _response = await admin.messaging().send(message as any); // sendMulticast in newer node sdk, or use tokens field with sendMulticast
      // Actually per docs: sendMulticast({ tokens: [], ... })
      const multicastResponse = await admin
        .messaging()
        .sendEachForMulticast(message as any);
      console.log(
        `✅ Push notification sent to user ${userId}. Success user count: ${multicastResponse.successCount}`,
      );

      // Clean up invalid tokens if needed
      if (multicastResponse.failureCount > 0) {
        const invalidTokens: string[] = [];
        multicastResponse.responses.forEach((resp, idx) => {
          if (
            !resp.success &&
            (resp.error?.code === 'messaging/invalid-registration-token' ||
              resp.error?.code ===
                'messaging/registration-token-not-registered')
          ) {
            invalidTokens.push(user.fcmTokens[idx]);
          }
        });
        if (invalidTokens.length > 0) {
          await this.removeInvalidTokens(userId, invalidTokens);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to send push notification:`, error);
    }
  }

  // Send to multiple users
  async sendBulkNotifications(
    userIds: string[],
    notification: {
      title: string;
      body: string;
      data?: any;
    },
  ) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fcmTokens: true },
    });

    const tokens = users.flatMap((u) => u.fcmTokens).filter((t) => t);

    if (tokens.length === 0) return;

    // Batches of 500
    const batchSize = 500;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batchTokens = tokens.slice(i, i + batchSize);
      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        tokens: batchTokens,
      };

      try {
        const response = await admin
          .messaging()
          .sendEachForMulticast(message as any);
        console.log(
          `✅ Sent batch ${i} notifications. Success: ${response.successCount}`,
        );
      } catch (error) {
        console.error('❌ Bulk notification batch failed:', error);
      }
    }
  }

  // Register FCM token
  async registerFCMToken(userId: string, token: string) {
    // Add token to array if not exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true },
    });
    const currentTokens = user?.fcmTokens || [];

    if (!currentTokens.includes(token)) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fcmTokens: { push: token } },
      });
    }
  }

  private async removeInvalidTokens(userId: string, tokensToRemove: string[]) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true },
    });
    if (!user) return;

    const newTokens = user.fcmTokens.filter((t) => !tokensToRemove.includes(t));
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmTokens: { set: newTokens } },
    });
  }

  // Maintain backward compatibility for existing calls
  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    channels: string[] = ['IN_APP'],
  ) {
    // 1. Create In-App
    await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        data: { channels },
      },
    });

    // 2. Send Push if requested
    if (channels.includes('PUSH')) {
      await this.sendPushNotification(userId, {
        title,
        body: message,
        data: { type },
      });
    }

    return { success: true };
  }
}
