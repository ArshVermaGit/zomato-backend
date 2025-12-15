import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { startOfDay, startOfWeek, startOfMonth, subDays, subMonths } from 'date-fns';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardMetrics() {
        const today = startOfDay(new Date());
        const startOfCurWeek = startOfWeek(new Date());
        const startOfCurMonth = startOfMonth(new Date());

        const [
            totalOrders,
            totalOrdersToday,
            totalRevenue,
            totalRevenueToday,
            activeUsers,
            activePartners
        ] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { createdAt: { gte: today } } }),
            this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: OrderStatus.DELIVERED } }),
            this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: today } } }),
            this.prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
            this.prisma.user.count({ where: { role: 'DELIVERY_PARTNER', isActive: true } })
        ]);

        return {
            orders: {
                total: totalOrders,
                today: totalOrdersToday
            },
            revenue: {
                total: totalRevenue._sum.totalAmount || 0,
                today: totalRevenueToday._sum.totalAmount || 0
            },
            users: {
                activeCustomers: activeUsers,
                activePartners: activePartners
            }
        };
    }

    async getOrderAnalytics(range: 'daily' | 'weekly' | 'monthly' = 'daily') {
        const startDate = this.getStartDate(range);

        // Group by Status
        const byStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: { id: true },
            where: { createdAt: { gte: startDate } }
        });

        // Peak Hours (Simple Aggregation - often requires raw query for extracted hour)
        // For MVP, we'll return raw data or simplified breakdown
        const orders = await this.prisma.order.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, status: true }
        });

        // Process in-memory for MVP due to Prisma limitations on date extraction without raw SQL
        const hourlyDistribution = new Array(24).fill(0);
        orders.forEach(o => {
            hourlyDistribution[o.createdAt.getHours()]++;
        });

        return {
            range,
            total: orders.length,
            byStatus: byStatus.map(s => ({ status: s.status, count: s._count.id })),
            peakHours: hourlyDistribution.map((count, hour) => ({ hour, count }))
        };
    }

    async getRevenueAnalytics(range: 'daily' | 'weekly' | 'monthly' = 'monthly') {
        const startDate = this.getStartDate(range);

        // Revenue Breakdown
        const revenue = await this.prisma.order.aggregate({
            _sum: {
                totalAmount: true,
                deliveryFee: true,
                platformFee: true,
                taxes: true,
                tip: true
            },
            where: {
                status: OrderStatus.DELIVERED,
                createdAt: { gte: startDate }
            }
        });

        // Revenue by Restaurant
        const byRestaurant = await this.prisma.order.groupBy({
            by: ['restaurantId'],
            _sum: { totalAmount: true },
            where: { status: OrderStatus.DELIVERED, createdAt: { gte: startDate } },
            take: 10,
            orderBy: { _sum: { totalAmount: 'desc' } }
        });

        // Fetch Restaurant Names
        const restaurantIds = byRestaurant.map(r => r.restaurantId);
        const restaurants = await this.prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: { id: true, name: true }
        });

        const topRestaurants = byRestaurant.map(r => {
            const name = restaurants.find(res => res.id === r.restaurantId)?.name || 'Unknown';
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
                netRevenue: (Number(revenue._sum?.platformFee) || 0)
            },
            topRestaurants
        };
    }

    private getStartDate(range: string): Date {
        const now = new Date();
        if (range === 'daily') return startOfDay(now);
        if (range === 'weekly') return subDays(now, 7);
        if (range === 'monthly') return subMonths(now, 1);
        return startOfDay(now);
    }
}
