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
var PaymentJobsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentJobsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const payments_service_1 = require("../../payments/payments.service");
let PaymentJobsProcessor = PaymentJobsProcessor_1 = class PaymentJobsProcessor {
    paymentsService;
    logger = new common_1.Logger(PaymentJobsProcessor_1.name);
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    processPayouts(_job) {
        this.logger.log('Processing Daily Payouts...');
    }
    retryFailedRefunds(_job) {
        this.logger.log('Retrying Failed Refunds...');
    }
};
exports.PaymentJobsProcessor = PaymentJobsProcessor;
__decorate([
    (0, bull_1.Process)('processPayouts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentJobsProcessor.prototype, "processPayouts", null);
__decorate([
    (0, bull_1.Process)('retryFailedRefunds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentJobsProcessor.prototype, "retryFailedRefunds", null);
exports.PaymentJobsProcessor = PaymentJobsProcessor = PaymentJobsProcessor_1 = __decorate([
    (0, bull_1.Processor)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentJobsProcessor);
//# sourceMappingURL=payment.processor.js.map