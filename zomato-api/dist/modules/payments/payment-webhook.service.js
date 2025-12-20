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
exports.PaymentWebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let PaymentWebhookService = class PaymentWebhookService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    verifyWebhookSignature(payload, signature, secret) {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
        return expectedSignature === signature;
    }
    async handleWebhook(payload, signature) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error('Webhook secret missing');
            throw new Error('Webhook secret not configured');
        }
        if (!this.verifyWebhookSignature(JSON.stringify(payload), signature, secret)) {
            throw new common_1.BadRequestException('Invalid Webhook Signature');
        }
        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;
        if (event === 'payment.captured') {
            await this.processPaymentSuccess(paymentEntity);
        }
        else if (event === 'payment.failed') {
            await this.processPaymentFailure(paymentEntity);
        }
        else if (event === 'refund.processed') {
        }
        return { status: 'ok' };
    }
    async processPaymentSuccess(razorpayPayment) {
        const razorpayOrderId = razorpayPayment.order_id;
        const _amount = razorpayPayment.amount;
        const payment = await this.prisma.paymentTransaction.findFirst({
            where: { gatewayTransactionId: razorpayOrderId },
        });
        if (payment && payment.status !== client_1.PaymentStatus.COMPLETED) {
            await this.prisma.paymentTransaction.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.COMPLETED,
                    gatewayTransactionId: razorpayPayment.id,
                    gatewayResponse: razorpayPayment,
                },
            });
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'COMPLETED' },
            });
            console.log(`Payment captured for Order ${payment.orderId}`);
        }
    }
    async processPaymentFailure(razorpayPayment) {
        const razorpayOrderId = razorpayPayment.order_id;
        const payment = await this.prisma.paymentTransaction.findFirst({
            where: { gatewayTransactionId: razorpayOrderId },
        });
        if (payment) {
            await this.prisma.paymentTransaction.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.FAILED,
                    gatewayTransactionId: razorpayPayment.id,
                    gatewayResponse: razorpayPayment,
                },
            });
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'FAILED' },
            });
        }
    }
};
exports.PaymentWebhookService = PaymentWebhookService;
exports.PaymentWebhookService = PaymentWebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentWebhookService);
//# sourceMappingURL=payment-webhook.service.js.map