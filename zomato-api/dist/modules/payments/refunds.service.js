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
exports.RefundsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const razorpay_service_1 = require("./razorpay.service");
const client_1 = require("@prisma/client");
let RefundsService = class RefundsService {
    prisma;
    razorpayService;
    constructor(prisma, razorpayService) {
        this.prisma = prisma;
        this.razorpayService = razorpayService;
    }
    calculateRefundPercentage(status) {
        switch (status) {
            case client_1.OrderStatus.PENDING:
                return 100;
            case client_1.OrderStatus.ACCEPTED:
                return 100;
            case client_1.OrderStatus.PREPARING:
                return 50;
            case client_1.OrderStatus.READY:
            case client_1.OrderStatus.PICKED_UP:
            case client_1.OrderStatus.DELIVERED:
                return 0;
            case client_1.OrderStatus.CANCELLED:
                return 0;
            default:
                return 0;
        }
    }
    async calculateRefund(orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const percentage = this.calculateRefundPercentage(order.status);
        const refundAmount = Number(order.totalAmount) * (percentage / 100);
        return {
            orderId,
            status: order.status,
            refundPercentage: percentage,
            refundAmount,
            currency: 'INR'
        };
    }
    async processRefund(orderId, type = 'GATEWAY', reason) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { paymentTransactions: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const payment = order.paymentTransactions.find(p => p.status === client_1.PaymentStatus.COMPLETED);
        if (!payment || !payment.gatewayTransactionId) {
            throw new common_1.BadRequestException('No completed payment found for this order');
        }
        const refundCalculation = await this.calculateRefund(orderId);
        if (refundCalculation.refundAmount <= 0) {
            throw new common_1.BadRequestException('Refund amount is zero based on order status');
        }
        if (type === 'GATEWAY') {
            return this.processGatewayRefund(payment.id, payment.gatewayTransactionId, refundCalculation.refundAmount, reason);
        }
        else {
            return this.processWalletRefund(order.customerId, payment.id, refundCalculation.refundAmount, reason);
        }
    }
    async processGatewayRefund(paymentId, razorpayPaymentId, amount, reason) {
        const refund = await this.razorpayService.refundPayment(razorpayPaymentId, amount, {
            reason
        });
        const refundRecord = await this.prisma.refund.create({
            data: {
                orderId: (await this.prisma.paymentTransaction.findUniqueOrThrow({ where: { id: paymentId } })).orderId,
                amount: new client_1.Prisma.Decimal(amount),
                status: client_1.RefundStatus.PROCESSED,
                reason,
                gatewayRefundId: refund.id
            }
        });
        await this.prisma.paymentTransaction.update({
            where: { id: paymentId },
            data: { status: client_1.PaymentStatus.REFUNDED }
        });
        return refundRecord;
    }
    async processWalletRefund(userId, paymentId, amount, reason) {
        throw new common_1.BadRequestException('Customer Wallet not currently supported. Use GATEWAY.');
    }
};
exports.RefundsService = RefundsService;
exports.RefundsService = RefundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map