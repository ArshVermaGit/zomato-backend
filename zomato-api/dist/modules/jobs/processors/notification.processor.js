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
var NotificationJobsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationJobsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../../notifications/notifications.service");
let NotificationJobsProcessor = NotificationJobsProcessor_1 = class NotificationJobsProcessor {
    notificationsService;
    logger = new common_1.Logger(NotificationJobsProcessor_1.name);
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    sendDailySummary(_job) {
        this.logger.log('Sending daily summary to partners...');
    }
    retryFailed(_job) {
    }
};
exports.NotificationJobsProcessor = NotificationJobsProcessor;
__decorate([
    (0, bull_1.Process)('sendDailySummary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationJobsProcessor.prototype, "sendDailySummary", null);
__decorate([
    (0, bull_1.Process)('retryFailed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationJobsProcessor.prototype, "retryFailed", null);
exports.NotificationJobsProcessor = NotificationJobsProcessor = NotificationJobsProcessor_1 = __decorate([
    (0, bull_1.Processor)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationJobsProcessor);
//# sourceMappingURL=notification.processor.js.map