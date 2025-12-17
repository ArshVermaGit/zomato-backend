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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const razorpay_1 = __importDefault(require("razorpay"));
let RazorpayService = class RazorpayService {
    razorpay;
    constructor() {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.razorpay = new razorpay_1.default({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        }
        else {
            console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set');
        }
    }
    async createOrder(amount, currency = 'INR', receipt) {
        if (!this.razorpay)
            throw new common_1.InternalServerErrorException('Payment gateway not configured');
        try {
            return await this.razorpay.orders.create({
                amount: Math.round(amount * 100),
                currency,
                receipt,
            });
        }
        catch (error) {
            console.error('Razorpay Create Order Error:', error);
            throw new common_1.InternalServerErrorException('Failed to create payment order');
        }
    }
    async fetchPayment(paymentId) {
        if (!this.razorpay)
            throw new common_1.InternalServerErrorException('Payment gateway not configured');
        try {
            return await this.razorpay.payments.fetch(paymentId);
        }
        catch (error) {
            console.error('Razorpay Fetch Payment Error:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch payment details');
        }
    }
    async refundPayment(paymentId, amount, notes = {}) {
        if (!this.razorpay)
            throw new common_1.InternalServerErrorException('Payment gateway not configured');
        try {
            return await this.razorpay.payments.refund(paymentId, {
                amount: Math.round(amount * 100),
                notes
            });
        }
        catch (error) {
            console.error('Razorpay Refund Error:', error);
            throw new common_1.InternalServerErrorException('Failed to process refund with gateway');
        }
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map