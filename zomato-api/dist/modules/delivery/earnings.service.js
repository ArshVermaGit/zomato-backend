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
exports.EarningsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let EarningsService = class EarningsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addTransaction(partnerId, amount, type, description) {
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.walletTransaction.create({
                data: {
                    deliveryPartnerId: partnerId,
                    amount: new client_1.Prisma.Decimal(amount),
                    type,
                    description,
                },
            });
            const increment = type === client_1.WalletTransactionType.CREDIT ? amount : -amount;
            await tx.deliveryPartner.update({
                where: { id: partnerId },
                data: {
                    availableBalance: { increment },
                    totalEarnings: type === client_1.WalletTransactionType.CREDIT
                        ? { increment: amount }
                        : undefined,
                },
            });
            return transaction;
        });
    }
    async processOrderEarnings(deliveryPartnerId, orderId, orderNumber, deliveryFee, tip, distanceKm = 2) {
        const BASE_PAY = 30;
        const PER_KM_RATE = 10;
        const DISTANCE_PAY = distanceKm * PER_KM_RATE;
        const _CHECKOUT_EARNING = Number(deliveryFee) * 0.8;
        let earningAmount = BASE_PAY + DISTANCE_PAY;
        const isPeakHour = new Date().getHours() >= 19 && new Date().getHours() <= 21;
        if (isPeakHour) {
            earningAmount += 20;
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.earning.create({
                data: {
                    deliveryPartnerId,
                    orderId,
                    type: 'DELIVERY_FEE',
                    amount: new client_1.Prisma.Decimal(earningAmount),
                    description: `Earnings for order #${orderNumber} (${distanceKm}km)`,
                },
            });
            if (tip > 0) {
                await tx.earning.create({
                    data: {
                        deliveryPartnerId,
                        orderId,
                        type: 'TIP',
                        amount: new client_1.Prisma.Decimal(tip),
                        description: `Tip for order #${orderNumber}`,
                    },
                });
            }
            const totalCredit = earningAmount + tip;
            await tx.deliveryPartner.update({
                where: { id: deliveryPartnerId },
                data: {
                    totalEarnings: { increment: totalCredit },
                    availableBalance: { increment: totalCredit },
                },
            });
            await tx.walletTransaction.create({
                data: {
                    deliveryPartnerId,
                    amount: new client_1.Prisma.Decimal(totalCredit),
                    type: client_1.WalletTransactionType.CREDIT,
                    description: `Order #${orderNumber} Earnings`,
                },
            });
            return { earningAmount, tip, total: totalCredit };
        });
    }
    async getBalance(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
        });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        return {
            currentBalance: partner.availableBalance,
            totalEarnings: partner.totalEarnings,
        };
    }
    async requestPayout(userId, amount) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
        });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        const balance = Number(partner.availableBalance);
        if (balance < amount) {
            throw new common_1.BadRequestException(`Insufficient balance. Current: ${balance}, Requested: ${amount}`);
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.deliveryPartner.update({
                where: { id: partner.id },
                data: { availableBalance: { decrement: amount } },
            });
            const payout = await tx.payoutRequest.create({
                data: {
                    deliveryPartnerId: partner.id,
                    amount: new client_1.Prisma.Decimal(amount),
                    status: client_1.PayoutStatus.PENDING,
                },
            });
            await tx.walletTransaction.create({
                data: {
                    deliveryPartnerId: partner.id,
                    amount: new client_1.Prisma.Decimal(amount),
                    type: client_1.WalletTransactionType.DEBIT,
                    description: `Payout Request ${payout.id}`,
                },
            });
            return payout;
        });
    }
    async createWalletTransaction(deliveryPartnerId, amount, type, description) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { id: deliveryPartnerId },
        });
        if (!partner)
            throw new common_1.NotFoundException('Delivery partner not found');
        const txnType = type === 'CREDIT'
            ? client_1.WalletTransactionType.CREDIT
            : client_1.WalletTransactionType.DEBIT;
        return this.prisma.walletTransaction.create({
            data: {
                deliveryPartnerId: partner.id,
                amount: new client_1.Prisma.Decimal(amount),
                type: txnType,
                description,
            },
        });
    }
    async getHistory(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
        });
        if (!partner)
            throw new common_1.NotFoundException('Delivery partner not found');
        return this.prisma.walletTransaction.findMany({
            where: { deliveryPartnerId: partner.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPayoutRequests(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
        });
        if (!partner)
            throw new common_1.NotFoundException('Delivery partner not found');
        return this.prisma.payoutRequest.findMany({
            where: { deliveryPartnerId: partner.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getStats(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
            include: {
                orders: {
                    where: { status: 'DELIVERED' },
                    select: { deliveredAt: true },
                },
            },
        });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        const totalDeliveries = partner.totalDeliveries;
        const rating = Number(partner.rating);
        return {
            totalDeliveries,
            averageRating: rating,
            acceptanceRate: 95,
            onTimeRate: 98,
            lifetimeEarnings: partner.totalEarnings,
        };
    }
};
exports.EarningsService = EarningsService;
exports.EarningsService = EarningsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EarningsService);
//# sourceMappingURL=earnings.service.js.map