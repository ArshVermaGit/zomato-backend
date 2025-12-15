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
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const { restaurantId, deliveryAddressId, items, paymentMethod, tip = 0, promoCode } = dto;
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        if (!restaurant.isActive || !restaurant.isOpen) {
            throw new common_1.BadRequestException('Restaurant is currently closed or unavailable');
        }
        const address = await this.prisma.address.findUnique({
            where: { id: deliveryAddressId }
        });
        if (!address)
            throw new common_1.NotFoundException('Delivery address not found');
        if (address.userId !== userId)
            throw new common_1.BadRequestException('Invalid address');
        const rLoc = restaurant.location;
        const uLoc = address.location;
        if (!rLoc || !rLoc.lat || !uLoc || !uLoc.lat) {
            throw new common_1.BadRequestException('Unable to calculate delivery distance. Location data missing.');
        }
        const distance = this.calculateDistance(rLoc.lat, rLoc.lng, uLoc.lat, uLoc.lng);
        const maxDeliveryRadius = 15;
        if (distance > maxDeliveryRadius) {
            throw new common_1.BadRequestException('Delivery address is out of range');
        }
        let itemTotal = 0;
        const orderItemsData = [];
        const itemIds = items.map(i => i.menuItemId);
        const dbItems = await this.prisma.menuItem.findMany({
            where: { id: { in: itemIds }, category: { restaurantId: restaurantId } },
            include: { modifiers: true }
        });
        if (dbItems.length !== new Set(itemIds).size) {
            throw new common_1.BadRequestException('Some items are invalid or do not belong to this restaurant');
        }
        const dbItemsMap = new Map(dbItems.map(i => [i.id, i]));
        for (const itemDto of items) {
            const dbItem = dbItemsMap.get(itemDto.menuItemId);
            if (!dbItem)
                throw new common_1.BadRequestException(`Item ${itemDto.menuItemId} not found`);
            if (!dbItem.isAvailable)
                throw new common_1.BadRequestException(`Item ${dbItem.name} is unavailable`);
            let setPrice = Number(dbItem.price);
            let modifiersTotal = 0;
            const modifiersJson = [];
            if (itemDto.modifiers && itemDto.modifiers.length > 0) {
                for (const modName of itemDto.modifiers) {
                    let found = false;
                    for (const group of dbItem.modifiers) {
                        const options = group.options || [];
                        const opt = options.find(o => o.name === modName);
                        if (opt) {
                            modifiersTotal += Number(opt.price || 0);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                    }
                }
            }
            const lineItemPrice = (setPrice + modifiersTotal) * itemDto.quantity;
            itemTotal += lineItemPrice;
            orderItemsData.push({
                menuItemId: dbItem.id,
                quantity: itemDto.quantity,
                price: setPrice,
                modifiers: itemDto.modifiers || [],
                instructions: itemDto.instructions
            });
        }
        const deliveryFee = this.calculateDeliveryFee(distance);
        const platformFee = 5;
        const taxes = Math.round(itemTotal * 0.05);
        let discount = 0;
        if (promoCode === 'WELCOME50') {
            discount = 50;
        }
        const subTotal = itemTotal + taxes + deliveryFee + platformFee + Number(tip);
        const finalTotal = Math.max(0, subTotal - discount);
        let method;
        switch (paymentMethod) {
            case 'COD':
                method = client_1.PaymentMethod.CASH_ON_DELIVERY;
                break;
            case 'UPI':
                method = client_1.PaymentMethod.UPI;
                break;
            case 'CARD':
                method = client_1.PaymentMethod.CARD;
                break;
            default: method = client_1.PaymentMethod.CASH_ON_DELIVERY;
        }
        const orderNumber = `ZOM${Date.now().toString().slice(-6)}`;
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    customerId: userId,
                    restaurantId,
                    deliveryAddress: address,
                    orderNumber,
                    status: client_1.OrderStatus.PENDING,
                    paymentStatus: client_1.PaymentStatus.PENDING,
                    paymentMethod: method,
                    pickupOtp: Math.floor(1000 + Math.random() * 9000).toString(),
                    deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
                    itemsTotal: itemTotal,
                    deliveryFee,
                    taxes,
                    tip: Number(tip),
                    discount,
                    totalAmount: finalTotal,
                    customerInstructions: dto.customerInstructions,
                    items: {
                        createMany: {
                            data: orderItemsData
                        }
                    }
                },
                include: { items: true }
            });
            return order;
        });
    }
    async findAll(userId, filters) {
        const { status, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = {
            customerId: userId
        };
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    restaurant: { select: { name: true, images: true, id: true } },
                    items: true
                }
            }),
            this.prisma.order.count({ where })
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async findOne(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                restaurant: true,
                deliveryPartner: { include: { user: { select: { name: true, phone: true } } } },
                items: { include: { menuItem: true } },
                review: true
            }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== userId)
            throw new common_1.ForbiddenException('Not your order');
        return order;
    }
    async findActive(userId) {
        const activeStatuses = Object.values(client_1.OrderStatus).filter(s => s !== client_1.OrderStatus.DELIVERED && s !== client_1.OrderStatus.CANCELLED);
        const order = await this.prisma.order.findFirst({
            where: {
                customerId: userId,
                status: { in: activeStatuses }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                restaurant: { select: { name: true, phone: true, location: true } },
                deliveryPartner: {
                    include: { user: { select: { name: true, phone: true } } }
                },
                items: true
            }
        });
        return order;
    }
    async rateOrder(userId, orderId, dto) {
        const { rating, comment } = dto;
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== userId)
            throw new common_1.ForbiddenException('Not your order');
        if (order.status !== client_1.OrderStatus.DELIVERED)
            throw new common_1.BadRequestException('Can only rate delivered orders');
        const existing = await this.prisma.review.findUnique({ where: { orderId } });
        if (existing)
            throw new common_1.BadRequestException('Order already rated');
        return this.prisma.$transaction(async (tx) => {
            const review = await tx.review.create({
                data: {
                    orderId,
                    userId,
                    restaurantId: order.restaurantId,
                    rating,
                    comment
                }
            });
            const aggregates = await tx.review.aggregate({
                where: { restaurantId: order.restaurantId },
                _avg: { rating: true },
                _count: { rating: true }
            });
            await tx.restaurant.update({
                where: { id: order.restaurantId },
                data: {
                    rating: aggregates._avg.rating || 0,
                    totalRatings: aggregates._count.rating || 0
                }
            });
            return review;
        });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    calculateDeliveryFee(distance) {
        const baseFee = 30;
        const ratePerKm = 10;
        if (distance <= 2)
            return baseFee;
        return Math.round(baseFee + (distance - 2) * ratePerKm);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map