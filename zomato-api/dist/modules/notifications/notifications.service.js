"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../database/prisma.service");
let NotificationsService = class NotificationsService {
    notificationsQueue;
    prisma;
    constructor(notificationsQueue, prisma) {
        this.notificationsQueue = notificationsQueue;
        this.prisma = prisma;
    }
    async sendNotification(userId, title, message, type, channels = ['IN_APP']) {
        if (channels.includes('IN_APP')) {
            await this.prisma.notification.create({
                data: {
                    userId,
                    title,
                    message,
                    type,
                    data: { channels }
                }
            });
        }
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
    async getUserNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }
    async registerDevice(userId, token) {
        console.log(`Registering device for ${userId}: ${token}`);
        return { success: true };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map