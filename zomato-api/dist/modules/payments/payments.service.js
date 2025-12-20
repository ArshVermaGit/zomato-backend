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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const razorpay_service_1 = require("./razorpay.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let PaymentsService = class PaymentsService {
    prisma;
    razorpayService;
    constructor(prisma, razorpayService) {
        this.prisma = prisma;
        this.razorpayService = razorpayService;
    }
    async processPayment(dto) {
        const razorpayOrder = await this.razorpayService.createOrder(dto.amount, 'INR', dto.orderId);
        const transaction = await this.prisma.paymentTransaction.create({
            data: {
                orderId: dto.orderId,
                amount: dto.amount,
                method: dto.method,
                status: client_1.PaymentStatus.PENDING,
                gatewayTransactionId: razorpayOrder.id,
                gatewayResponse: razorpayOrder,
            },
        });
        return {
            transactionId: transaction.id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            status: 'PENDING',
            key: process.env.RAZORPAY_KEY_ID,
        };
    }
    async createPaymentOrder(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== userId)
            throw new common_1.BadRequestException('Unauthorized access to order');
        return this.processPayment({
            amount: Number(order.totalAmount),
            method: 'ONLINE',
            orderId: order.id,
            customerId: userId,
        });
    }
    async createAdHocPayment(userId, amount, purpose) {
        const razorpayOrder = await this.razorpayService.createOrder(amount, 'INR', `ADHOC_${Date.now()}`);
        await this.prisma.paymentTransaction.create({
            data: {
                amount: amount,
                method: client_1.PaymentMethod.UPI,
                status: client_1.PaymentStatus.PENDING,
                gatewayTransactionId: razorpayOrder.id,
                gatewayResponse: { ...razorpayOrder, purpose, userId },
            },
        });
        return {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        };
    }
    async verifyPayment(orderId, paymentId, razorpayOrderId, signature) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret)
            throw new Error('Razorpay secret not configured');
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpayOrderId + '|' + paymentId)
            .digest('hex');
        if (generatedSignature !== signature) {
            throw new common_1.BadRequestException('Invalid Payment Signature');
        }
        const transaction = await this.prisma.paymentTransaction.findFirst({
            where: { gatewayTransactionId: razorpayOrderId },
        });
        if (transaction) {
            await this.prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: {
                    status: client_1.PaymentStatus.COMPLETED,
                    gatewayResponse: { razorpayPaymentId: paymentId, signature },
                },
            });
            if (transaction.orderId) {
                await this.prisma.order.update({
                    where: { id: transaction.orderId },
                    data: { paymentStatus: 'COMPLETED' },
                });
            }
        }
        return { success: true };
    }
    async handleWebhook(payload, signature) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret)
            throw new Error('Razorpay webhook secret not configured');
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        if (expectedSignature !== signature) {
            console.warn('Invalid webhook signature');
        }
        switch (payload.event) {
            case 'payment.captured':
                await this.handlePaymentCaptured(payload.payload.payment.entity);
                break;
            case 'payment.failed':
                await this.handlePaymentFailed(payload.payload.payment.entity);
                break;
        }
        return { status: 'ok' };
    }
    async handlePaymentCaptured(payment) {
        const gatewayOrderId = payment.order_id;
        await this.prisma.paymentTransaction.updateMany({
            where: { gatewayTransactionId: gatewayOrderId },
            data: {
                status: client_1.PaymentStatus.COMPLETED,
                gatewayResponse: payment,
            },
        });
        const transaction = await this.prisma.paymentTransaction.findFirst({
            where: { gatewayTransactionId: gatewayOrderId },
        });
        if (transaction && transaction.orderId) {
            await this.prisma.order.update({
                where: { id: transaction.orderId },
                data: { paymentStatus: 'COMPLETED' },
            });
        }
    }
    async handlePaymentFailed(payment) {
        const gatewayOrderId = payment.order_id;
        await this.prisma.paymentTransaction.updateMany({
            where: { gatewayTransactionId: gatewayOrderId },
            data: {
                status: client_1.PaymentStatus.FAILED,
                gatewayResponse: payment,
            },
        });
        const transaction = await this.prisma.paymentTransaction.findFirst({
            where: { gatewayTransactionId: gatewayOrderId },
        });
        if (transaction && transaction.orderId) {
            await this.prisma.order.update({
                where: { id: transaction.orderId },
                data: { paymentStatus: 'FAILED' },
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map