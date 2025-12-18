"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const prisma_service_1 = require("../../database/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
        if (!admin.apps.length) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
            }
            catch (error) {
                console.warn('Firebase init failed (likely missing env vars):', error);
            }
        }
    }
    async sendPushNotification(userId, notification) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { fcmTokens: true },
        });
        if (!user?.fcmTokens || user.fcmTokens.length === 0) {
            console.log(`No FCM tokens for user ${userId}`);
            return;
        }
        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: notification.data || {},
            tokens: user.fcmTokens,
            android: {
                priority: 'high',
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
            const response = await admin.messaging().send(message);
            const multicastResponse = await admin.messaging().sendEachForMulticast(message);
            console.log(`✅ Push notification sent to user ${userId}. Success user count: ${multicastResponse.successCount}`);
            if (multicastResponse.failureCount > 0) {
                const invalidTokens = [];
                multicastResponse.responses.forEach((resp, idx) => {
                    if (!resp.success && (resp.error?.code === 'messaging/invalid-registration-token' || resp.error?.code === 'messaging/registration-token-not-registered')) {
                        invalidTokens.push(user.fcmTokens[idx]);
                    }
                });
                if (invalidTokens.length > 0) {
                    await this.removeInvalidTokens(userId, invalidTokens);
                }
            }
        }
        catch (error) {
            console.error(`❌ Failed to send push notification:`, error);
        }
    }
    async sendBulkNotifications(userIds, notification) {
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, fcmTokens: true },
        });
        const tokens = users
            .flatMap(u => u.fcmTokens)
            .filter(t => t);
        if (tokens.length === 0)
            return;
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
                const response = await admin.messaging().sendEachForMulticast(message);
                console.log(`✅ Sent batch ${i} notifications. Success: ${response.successCount}`);
            }
            catch (error) {
                console.error('❌ Bulk notification batch failed:', error);
            }
        }
    }
    async registerFCMToken(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { fcmTokens: true } });
        const currentTokens = user?.fcmTokens || [];
        if (!currentTokens.includes(token)) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { fcmTokens: { push: token } },
            });
        }
    }
    async removeInvalidTokens(userId, tokensToRemove) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { fcmTokens: true } });
        if (!user)
            return;
        const newTokens = user.fcmTokens.filter(t => !tokensToRemove.includes(t));
        await this.prisma.user.update({
            where: { id: userId },
            data: { fcmTokens: { set: newTokens } }
        });
    }
    async sendNotification(userId, title, message, type, channels = ['IN_APP']) {
        await this.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                data: { channels }
            }
        });
        if (channels.includes('PUSH')) {
            await this.sendPushNotification(userId, {
                title,
                body: message,
                data: { type }
            });
        }
        return { success: true };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map