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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../../database/prisma.service");
let JobsService = JobsService_1 = class JobsService {
    orderQueue;
    notificationQueue;
    analyticsQueue;
    paymentQueue;
    prisma;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(orderQueue, notificationQueue, analyticsQueue, paymentQueue, prisma) {
        this.orderQueue = orderQueue;
        this.notificationQueue = notificationQueue;
        this.analyticsQueue = analyticsQueue;
        this.paymentQueue = paymentQueue;
        this.prisma = prisma;
    }
    async triggerOrderMaintenance() {
        this.logger.debug('Triggering Order Maintenance Job');
        await this.orderQueue.add('autoCancelUnpaid', {}, { attempts: 3 });
        await this.orderQueue.add('monitorStuckOrders', {}, { removeOnComplete: true });
    }
    async triggerDailyNotifications() {
        this.logger.debug('Triggering Daily Partner Summary');
        await this.notificationQueue.add('sendDailySummary', {});
    }
    async triggerMidnightJobs() {
        this.logger.debug('Triggering Midnight Analytics & Payouts');
        await this.analyticsQueue.add('calculateDailyMetrics', {});
        await this.paymentQueue.add('processPayouts', {});
        await this.cleanupData();
    }
    async cleanupData() {
        this.logger.log('Running daily cleanup...');
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        this.logger.log(`Scanning for orders older than ${oneYearAgo.toISOString()}`);
    }
};
exports.JobsService = JobsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "triggerOrderMaintenance", null);
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "triggerDailyNotifications", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "triggerMidnightJobs", null);
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('orders')),
    __param(1, (0, bull_1.InjectQueue)('notifications')),
    __param(2, (0, bull_1.InjectQueue)('analytics')),
    __param(3, (0, bull_1.InjectQueue)('payments')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map