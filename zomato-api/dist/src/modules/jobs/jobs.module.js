"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bull_1 = require("@nestjs/bull");
const jobs_service_1 = require("./jobs.service");
const order_processor_1 = require("./processors/order.processor");
const notification_processor_1 = require("./processors/notification.processor");
const analytics_processor_1 = require("./processors/analytics.processor");
const payment_processor_1 = require("./processors/payment.processor");
const prisma_service_1 = require("../../database/prisma.service");
const orders_module_1 = require("../orders/orders.module");
const notifications_module_1 = require("../notifications/notifications.module");
const analytics_module_1 = require("../analytics/analytics.module");
const payments_module_1 = require("../payments/payments.module");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            bull_1.BullModule.registerQueue({ name: 'orders' }, { name: 'notifications' }, { name: 'analytics' }, { name: 'payments' }),
            orders_module_1.OrdersModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            payments_module_1.PaymentsModule
        ],
        providers: [
            jobs_service_1.JobsService,
            order_processor_1.OrderJobsProcessor,
            notification_processor_1.NotificationJobsProcessor,
            analytics_processor_1.AnalyticsJobsProcessor,
            payment_processor_1.PaymentJobsProcessor,
            prisma_service_1.PrismaService
        ],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map