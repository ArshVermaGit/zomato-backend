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
    async createPaymentOrder(userId, orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== userId)
            throw new common_1.BadRequestException('Unauthorized access to order');
        const razorpayOrder = await this.razorpayService.createOrder(Number(order.totalAmount), 'INR', order.orderNumber);
        await this.prisma.payment.create({
            data: {
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                amount: Number(order.totalAmount),
                status: client_1.PaymentStatus.PENDING
            }
        });
        return {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
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
        const payment = await this.prisma.payment.findFirst({ where: { razorpayOrderId } });
        if (payment) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.COMPLETED,
                    razorpayPaymentId: paymentId,
                    method: 'UNKNOWN'
                }
            });
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'COMPLETED',
            }
        });
        return { success: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map