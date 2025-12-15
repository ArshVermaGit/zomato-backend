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
    async addTransaction(partnerId, amount, type, category, description, referenceId) {
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.walletTransaction.create({
                data: {
                    partnerId,
                    amount,
                    type,
                    category,
                    description,
                    referenceId
                }
            });
            const increment = type === client_1.TransactionType.CREDIT ? amount : -amount;
            await tx.deliveryPartner.update({
                where: { id: partnerId },
                data: {
                    currentBalance: { increment },
                    earnings: type === client_1.TransactionType.CREDIT ? { increment: amount } : undefined
                }
            });
            return transaction;
        });
    }
    calculateOrderEarnings(distanceKm, orderTotal) {
        const BASE_FEE = 30;
        const PER_KM_RATE = 10;
        const distanceFee = distanceKm * PER_KM_RATE;
        return BASE_FEE + distanceFee;
    }
    async getBalance(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        return {
            currentBalance: partner.currentBalance,
            totalEarnings: partner.earnings
        };
    }
    async requestPayout(userId, amount) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        const balance = Number(partner.currentBalance);
        if (balance < amount) {
            throw new common_1.BadRequestException(`Insufficient balance. Current: ${balance}, Requested: ${amount}`);
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.deliveryPartner.update({
                where: { id: partner.id },
                data: { currentBalance: { decrement: amount } }
            });
            const payout = await tx.payoutRequest.create({
                data: {
                    partnerId: partner.id,
                    amount,
                    status: client_1.PayoutStatus.PENDING,
                    method: 'UPI'
                }
            });
            await tx.walletTransaction.create({
                data: {
                    partnerId: partner.id,
                    amount,
                    type: client_1.TransactionType.DEBIT,
                    category: client_1.TransactionCategory.PAYOUT,
                    description: `Payout Request ${payout.id}`,
                    referenceId: payout.id
                }
            });
            return payout;
        });
    }
    async getTransactions(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        return this.prisma.walletTransaction.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPayoutHistory(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        return this.prisma.payoutRequest.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPerformanceMetrics(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
            include: {
                orders: {
                    where: { status: 'DELIVERED' },
                    select: { createdAt: true, deliveredAt: true }
                }
            }
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
            lifetimeEarnings: partner.earnings
        };
    }
};
exports.EarningsService = EarningsService;
exports.EarningsService = EarningsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EarningsService);
//# sourceMappingURL=earnings.service.js.map