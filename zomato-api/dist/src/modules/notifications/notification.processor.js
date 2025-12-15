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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../database/prisma.service");
const firebase_service_1 = require("./firebase.service");
const twilio_service_1 = require("./twilio.service");
const sendgrid_service_1 = require("./sendgrid.service");
let NotificationProcessor = class NotificationProcessor {
    prisma;
    firebase;
    twilio;
    sendGrid;
    constructor(prisma, firebase, twilio, sendGrid) {
        this.prisma = prisma;
        this.firebase = firebase;
        this.twilio = twilio;
        this.sendGrid = sendGrid;
    }
    async handleNotification(job) {
        const { userId, title, body, channels } = job.data;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        for (const channel of channels) {
            try {
                switch (channel) {
                    case 'PUSH':
                        if (user.fcmTokens && user.fcmTokens.length > 0) {
                            for (const token of user.fcmTokens) {
                                await this.firebase.sendPushNotification(token, title, body);
                            }
                        }
                        break;
                    case 'SMS':
                        if (user.phone) {
                            await this.twilio.sendSms(user.phone, `${title}: ${body}`);
                        }
                        break;
                    case 'EMAIL':
                        if (user.email) {
                            await this.sendGrid.sendEmail(user.email, title, body);
                        }
                        break;
                }
            }
            catch (err) {
                console.error(`Failed to send ${channel} notification to user ${userId}`, err);
            }
        }
    }
};
exports.NotificationProcessor = NotificationProcessor;
__decorate([
    (0, bull_1.Process)('send_notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "handleNotification", null);
exports.NotificationProcessor = NotificationProcessor = __decorate([
    (0, bull_1.Processor)('notifications'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        firebase_service_1.FirebaseService,
        twilio_service_1.TwilioService,
        sendgrid_service_1.SendGridService])
], NotificationProcessor);
//# sourceMappingURL=notification.processor.js.map