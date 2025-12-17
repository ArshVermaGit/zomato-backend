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
var OrderJobsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderJobsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
let OrderJobsProcessor = OrderJobsProcessor_1 = class OrderJobsProcessor {
    prisma;
    logger = new common_1.Logger(OrderJobsProcessor_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleAutoCancel(job) {
        this.logger.debug('Checking for unpaid orders to auto-cancel...');
        const tenMinutesAgo = (0, date_fns_1.subMinutes)(new Date(), 10);
        const unpaidOrders = await this.prisma.order.findMany({
            where: {
                status: client_1.OrderStatus.PENDING,
                paymentStatus: client_1.PaymentStatus.PENDING,
                createdAt: { lt: tenMinutesAgo }
            }
        });
        for (const order of unpaidOrders) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    status: client_1.OrderStatus.CANCELLED,
                }
            });
            this.logger.log(`Auto-cancelled order ${order.orderNumber}`);
        }
    }
    async monitorStuckOrders(job) {
        const twoHoursAgo = (0, date_fns_1.subHours)(new Date(), 2);
        const stuckOrders = await this.prisma.order.findMany({
            where: {
                status: client_1.OrderStatus.OUT_FOR_DELIVERY,
                updatedAt: { lt: twoHoursAgo }
            }
        });
        if (stuckOrders.length > 0) {
            this.logger.warn(`Found ${stuckOrders.length} stuck orders! IDs: ${stuckOrders.map(o => o.id).join(', ')}`);
        }
    }
    async handleAssignment(job) {
        this.logger.log(`Processing assignment for order ${job.data.orderId}`);
    }
};
exports.OrderJobsProcessor = OrderJobsProcessor;
__decorate([
    (0, bull_1.Process)('autoCancelUnpaid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderJobsProcessor.prototype, "handleAutoCancel", null);
__decorate([
    (0, bull_1.Process)('monitorStuckOrders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderJobsProcessor.prototype, "monitorStuckOrders", null);
__decorate([
    (0, bull_1.Process)('assignDeliveryPartner'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderJobsProcessor.prototype, "handleAssignment", null);
exports.OrderJobsProcessor = OrderJobsProcessor = OrderJobsProcessor_1 = __decorate([
    (0, bull_1.Processor)('orders'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderJobsProcessor);
//# sourceMappingURL=order.processor.js.map