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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const websocket_gateway_1 = require("../../websockets/websocket.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
const payments_service_1 = require("../payments/payments.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    realtimeGateway;
    notificationsService;
    paymentsService;
    constructor(prisma, realtimeGateway, notificationsService, paymentsService) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.notificationsService = notificationsService;
        this.paymentsService = paymentsService;
    }
    async createOrder(customerId, dto) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: dto.restaurantId,
                isActive: true,
                isOpen: true,
            },
            include: {
                menuCategories: {
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!restaurant) {
            throw new common_1.BadRequestException('Restaurant is not available');
        }
        let itemsTotal = 0;
        const orderItems = [];
        if (!dto.items || dto.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain items');
        }
        for (const item of dto.items) {
            const menuItem = await this.prisma.menuItem.findFirst({
                where: {
                    id: item.menuItemId,
                    isAvailable: true,
                },
                include: {
                    modifiers: true,
                },
            });
            if (!menuItem) {
                throw new common_1.BadRequestException(`Item ${item.menuItemId} not available`);
            }
            let itemPrice = Number(menuItem.price) * item.quantity;
            const itemWithModifiers = item;
            if (itemWithModifiers.selectedModifiers) {
                for (const mod of itemWithModifiers.selectedModifiers) {
                    itemPrice += (Number(mod.price) || 0) * item.quantity;
                }
            }
            itemsTotal += itemPrice;
            orderItems.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: itemPrice / item.quantity,
                selectedModifiers: itemWithModifiers.selectedModifiers || client_1.Prisma.JsonNull,
                specialInstructions: item.specialInstructions,
            });
        }
        const deliveryFee = Number(restaurant.deliveryFee);
        const taxes = itemsTotal * 0.05;
        let discount = 0;
        if (dto.promoCode) {
            const promo = await this.validatePromo(dto.promoCode, itemsTotal);
            if (promo) {
                discount = promo.discountType === 'PERCENTAGE'
                    ? (itemsTotal * Number(promo.discountValue)) / 100
                    : Number(promo.discountValue);
                if (promo.maxDiscount) {
                    discount = Math.min(discount, Number(promo.maxDiscount));
                }
            }
        }
        const totalAmount = itemsTotal + deliveryFee + taxes - discount + (dto.tip || 0);
        const orderNumber = `ZOM${Date.now().toString().slice(-8)}`;
        const pickupOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const deliveryOTP = Math.floor(100000 + Math.random() * 900000).toString();
        let paymentStatus = client_1.PaymentStatus.PENDING;
        let paymentTransactionId = null;
        if (dto.paymentMethod !== 'COD') {
        }
        const orderRaw = await this.prisma.order.create({
            data: {
                orderNumber,
                customerId,
                restaurantId: dto.restaurantId,
                items: {
                    create: orderItems,
                },
                deliveryAddress: dto.deliveryAddress || {},
                customerInstructions: dto.customerInstructions,
                itemsTotal,
                deliveryFee,
                taxes,
                discount,
                tip: dto.tip || 0,
                totalAmount,
                paymentMethod: dto.paymentMethod === 'COD' ? client_1.PaymentMethod.CASH_ON_DELIVERY : client_1.PaymentMethod.UPI,
                paymentStatus,
                paymentTransactionId,
                pickupOTP,
                deliveryOTP,
                estimatedDeliveryTime: (restaurant.preparationTime || 30) + 20,
                promoCode: dto.promoCode,
            },
            include: {
                customer: true,
                restaurant: {
                    include: {
                        partner: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        const order = orderRaw;
        if (dto.promoCode) {
            await this.prisma.promo.update({
                where: { code: dto.promoCode },
                data: { usedCount: { increment: 1 } },
            });
        }
        this.realtimeGateway.notifyNewOrder(order);
        if (order.restaurant.partner?.userId) {
            await this.notificationsService.sendNotification(order.restaurant.partner.userId, 'New Order! 🔔', `Order #${orderNumber} - ₹${totalAmount}`, 'ORDER_PLACED');
        }
        await this.notificationsService.sendNotification(customerId, 'Order Placed Successfully!', `Your order #${orderNumber} has been placed`, 'ORDER_PLACED');
        this.realtimeGateway.emitToAdmins('order:new', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            restaurant: order.restaurant.name,
            totalAmount: order.totalAmount,
        });
        return order;
    }
    async acceptOrder(orderId, restaurantPartnerId, estimatedPrepTime) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                restaurant: {
                    partnerId: restaurantPartnerId,
                },
            },
            include: {
                customer: true,
                restaurant: true,
            },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found or already processed');
        }
        const updatedOrderRaw = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: client_1.OrderStatus.ACCEPTED,
                acceptedAt: new Date(),
                estimatedDeliveryTime: estimatedPrepTime + 20,
            },
            include: {
                customer: true,
                restaurant: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        const updatedOrder = updatedOrderRaw;
        this.realtimeGateway.notifyOrderAccepted(updatedOrder);
        await this.notificationsService.sendNotification(updatedOrder.customerId, 'Order Accepted! 👨‍🍳', `${updatedOrder.restaurant.name} is preparing your order`, 'ORDER_ACCEPTED');
        return updatedOrder;
    }
    async markOrderReady(orderId, restaurantPartnerId) {
        const order = await this.prisma.order.update({
            where: {
                id: orderId,
                restaurant: {
                    partnerId: restaurantPartnerId,
                },
            },
            data: {
                status: client_1.OrderStatus.READY,
                readyAt: new Date(),
            },
            include: {
                customer: true,
                restaurant: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
        this.realtimeGateway.notifyOrderReady(order);
        const loc = order.restaurant.location;
        if (loc && loc.lat) {
            const nearbyPartners = await this.findNearbyDeliveryPartners(loc, 5);
            for (const partner of nearbyPartners) {
                await this.notificationsService.sendNotification(partner.userId, 'New Delivery Available! 🚴', `Order from ${order.restaurant.name} - Earn ₹${Number(order.deliveryFee) * 0.8}`, 'ORDER_READY');
            }
        }
        this.realtimeGateway.emitToCustomer(order.customerId, 'order:ready', {
            orderId: order.id,
            orderNumber: order.orderNumber,
        });
        return order;
    }
    async assignDeliveryPartner(orderId, deliveryPartnerId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                status: client_1.OrderStatus.READY,
                deliveryPartnerId: null,
            },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not available');
        }
        const partner = await this.prisma.deliveryPartner.findFirst({
            where: {
                id: deliveryPartnerId,
                isAvailable: true,
                isOnline: true,
            },
        });
        if (!partner) {
            throw new common_1.BadRequestException('Delivery partner not available');
        }
        const updatedOrderRaw = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                deliveryPartnerId,
                status: client_1.OrderStatus.PICKED_UP,
            },
            include: {
                customer: true,
                restaurant: true,
                deliveryPartner: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const updatedOrder = updatedOrderRaw;
        await this.prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: { isAvailable: false },
        });
        this.realtimeGateway.notifyDeliveryPartnerAssigned(updatedOrder);
        this.realtimeGateway.emitToRestaurant(updatedOrder.restaurantId, 'order:delivery_partner_assigned', {
            orderId: updatedOrder.id,
            deliveryPartner: updatedOrder.deliveryPartner.user.name,
        });
        await this.notificationsService.sendNotification(updatedOrder.customerId, 'Delivery Partner Assigned! 🚴', `${updatedOrder.deliveryPartner.user.name} will deliver your order`, 'ORDER_PICKED_UP');
        return updatedOrder;
    }
    async updateDeliveryLocation(orderId, deliveryPartnerId, location) {
        await this.prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: {
                currentLocation: location,
            },
        });
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (order) {
            this.realtimeGateway.notifyLocationUpdate(orderId, order.customerId, location);
        }
        return { success: true };
    }
    async markOrderDelivered(orderId, deliveryPartnerId, deliveryOTP) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                deliveryPartnerId,
                deliveryOTP: deliveryOTP,
            },
            include: {
                customer: true,
                restaurant: true,
                deliveryPartner: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.BadRequestException('Invalid OTP or order not found');
        }
        const actualDeliveryTime = Math.floor((new Date().getTime() - new Date(order.placedAt || order.createdAt).getTime()) / 60000);
        const updatedOrderRaw = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: client_1.OrderStatus.DELIVERED,
                deliveredAt: new Date(),
                actualDeliveryTime,
            },
            include: {
                customer: true,
                restaurant: true,
                deliveryPartner: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const updatedOrder = updatedOrderRaw;
        await this.prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: {
                isAvailable: true,
                totalDeliveries: { increment: 1 },
            },
        });
        const earningAmount = Number(order.deliveryFee) * 0.8;
        await this.prisma.earning.create({
            data: {
                deliveryPartnerId,
                orderId: order.id,
                type: 'DELIVERY_FEE',
                amount: earningAmount,
                description: `Delivery for order #${order.orderNumber}`,
            },
        });
        if (order.tip && Number(order.tip) > 0) {
            await this.prisma.earning.create({
                data: {
                    deliveryPartnerId,
                    orderId: order.id,
                    type: 'TIP',
                    amount: Number(order.tip),
                    description: `Tip from customer for order #${order.orderNumber}`,
                },
            });
        }
        await this.prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: {
                totalEarnings: { increment: earningAmount + Number(order.tip || 0) },
                availableBalance: { increment: earningAmount + Number(order.tip || 0) },
            },
        });
        this.realtimeGateway.notifyOrderDelivered(updatedOrder);
        await this.notificationsService.sendNotification(updatedOrder.customerId, 'Order Delivered! 🎉', 'Enjoy your meal! Please rate your experience', 'ORDER_DELIVERED');
        await this.prisma.customer.update({
            where: { userId: updatedOrder.customerId },
            data: {
                totalOrders: { increment: 1 },
                totalSpent: { increment: Number(updatedOrder.totalAmount) },
            },
        });
        return updatedOrder;
    }
    async findAll(customerId, filters) {
        const where = { customerId };
        if (filters.status)
            where.status = filters.status;
        return this.prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { restaurant: true, items: { include: { menuItem: true } } }
        });
    }
    async findActive(customerId) {
        return this.prisma.order.findFirst({
            where: {
                customerId,
                status: { notIn: [client_1.OrderStatus.DELIVERED, client_1.OrderStatus.CANCELLED] }
            },
            include: {
                restaurant: true,
                items: { include: { menuItem: true } },
                deliveryPartner: { include: { user: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(customerId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                restaurant: true,
                deliveryPartner: { include: { user: true } },
                items: { include: { menuItem: true } },
                review: true
            }
        });
        if (!order || order.customerId !== customerId) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async rateOrder(customerId, orderId, dto) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, customerId, status: client_1.OrderStatus.DELIVERED }
        });
        if (!order)
            throw new common_1.BadRequestException('Order cannot be rated');
        const review = await this.prisma.review.create({
            data: {
                orderId,
                userId: order.customerId,
                restaurantId: order.restaurantId,
                rating: dto.rating,
                comment: dto.comment,
                deliveryRating: dto.deliveryRating,
                tags: dto.tags || []
            }
        });
        return review;
    }
    async findAvailableForDelivery(lat, lng) {
        const orders = await this.prisma.$queryRaw `
        SELECT o.*, r.name as "restaurantName", r.address as "restaurantAddress",
        (
           6371 * acos(
             cos(radians(${lat})) 
             * cos(radians((r.location->>'lat')::float)) 
             * cos(radians((r.location->>'lng')::float) - radians(${lng})) 
             + sin(radians(${lat})) 
             * sin(radians((r.location->>'lat')::float))
           )
         ) AS distance
        FROM "Order" o
        JOIN "Restaurant" r ON o."restaurantId" = r.id
        WHERE o.status = 'READY' AND o."deliveryPartnerId" IS NULL
        AND (
           6371 * acos(
             cos(radians(${lat})) 
             * cos(radians((r.location->>'lat')::float)) 
             * cos(radians((r.location->>'lng')::float) - radians(${lng})) 
             + sin(radians(${lat})) 
             * sin(radians((r.location->>'lat')::float))
           )
         ) <= 10
        ORDER BY distance ASC
      `;
        return orders;
    }
    async findNearbyDeliveryPartners(location, radiusKm) {
        return this.prisma.$queryRaw `
      SELECT dp.*, u.name, u.phone 
      FROM "DeliveryPartner" dp 
      JOIN "User" u ON dp."userId" = u.id 
      WHERE 
         dp."isAvailable" = true 
         AND dp."isOnline" = true
         AND dp."currentLocation" IS NOT NULL
         AND (
           6371 * acos(
             cos(radians(${location.lat})) 
             * cos(radians((dp."currentLocation"->>'lat')::float)) 
             * cos(radians((dp."currentLocation"->>'lng')::float) - radians(${location.lng})) 
             + sin(radians(${location.lat})) 
             * sin(radians((dp."currentLocation"->>'lat')::float))
           )
         ) <= ${radiusKm}
      LIMIT 10
    `;
    }
    async validatePromo(code, orderAmount) {
        const promo = await this.prisma.promo.findFirst({
            where: {
                code,
                isActive: true,
                validFrom: { lte: new Date() },
                validUntil: { gte: new Date() },
                minOrderValue: { lte: orderAmount },
            },
        });
        if (!promo)
            return null;
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return null;
        }
        return promo;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        websocket_gateway_1.RealtimeGateway,
        notifications_service_1.NotificationsService,
        payments_service_1.PaymentsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map