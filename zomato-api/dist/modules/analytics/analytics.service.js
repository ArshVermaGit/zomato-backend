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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardMetrics() {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const _startOfCurWeek = (0, date_fns_1.startOfWeek)(new Date());
        const _startOfCurMonth = (0, date_fns_1.startOfMonth)(new Date());
        const [totalOrders, totalOrdersToday, totalRevenue, totalRevenueToday, activeUsers, activePartners,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { createdAt: { gte: today } } }),
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: client_1.OrderStatus.DELIVERED },
            }),
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: client_1.OrderStatus.DELIVERED, createdAt: { gte: today } },
            }),
            this.prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
            this.prisma.user.count({
                where: { role: 'DELIVERY_PARTNER', isActive: true },
            }),
        ]);
        return {
            orders: {
                total: totalOrders,
                today: totalOrdersToday,
            },
            revenue: {
                total: totalRevenue._sum.totalAmount || 0,
                today: totalRevenueToday._sum.totalAmount || 0,
            },
            users: {
                activeCustomers: activeUsers,
                activePartners: activePartners,
            },
        };
    }
    async getOrderAnalytics(range = 'daily') {
        const startDate = this.getStartDate(range);
        const byStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: { id: true },
            where: { createdAt: { gte: startDate } },
        });
        const orders = await this.prisma.order.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, status: true },
        });
        const hourlyDistribution = new Array(24).fill(0);
        orders.forEach((o) => {
            hourlyDistribution[o.createdAt.getHours()]++;
        });
        return {
            range,
            total: orders.length,
            byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
            peakHours: hourlyDistribution.map((count, hour) => ({ hour, count })),
        };
    }
    async getRevenueAnalytics(range = 'monthly') {
        const startDate = this.getStartDate(range);
        const revenue = await this.prisma.order.aggregate({
            _sum: {
                totalAmount: true,
                deliveryFee: true,
                platformFee: true,
                taxes: true,
                tip: true,
            },
            where: {
                status: client_1.OrderStatus.DELIVERED,
                createdAt: { gte: startDate },
            },
        });
        const byRestaurant = await this.prisma.order.groupBy({
            by: ['restaurantId'],
            _sum: { totalAmount: true },
            where: { status: client_1.OrderStatus.DELIVERED, createdAt: { gte: startDate } },
            take: 10,
            orderBy: { _sum: { totalAmount: 'desc' } },
        });
        const restaurantIds = byRestaurant.map((r) => r.restaurantId);
        const restaurants = await this.prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: { id: true, name: true },
        });
        const topRestaurants = byRestaurant.map((r) => {
            const name = restaurants.find((res) => res.id === r.restaurantId)?.name || 'Unknown';
            return { restaurant: name, revenue: r._sum.totalAmount };
        });
        return {
            range,
            totalRevenue: revenue._sum?.totalAmount || 0,
            breakdown: {
                deliveryFees: revenue._sum?.deliveryFee || 0,
                platformFees: revenue._sum?.platformFee || 0,
                taxes: revenue._sum?.taxes || 0,
                tips: revenue._sum?.tip || 0,
                netRevenue: Number(revenue._sum?.platformFee) || 0,
            },
            topRestaurants,
        };
    }
    getStartDate(range) {
        const now = new Date();
        if (range === 'daily')
            return (0, date_fns_1.startOfDay)(now);
        if (range === 'weekly')
            return (0, date_fns_1.subDays)(now, 7);
        if (range === 'monthly')
            return (0, date_fns_1.subMonths)(now, 1);
        return (0, date_fns_1.startOfDay)(now);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map