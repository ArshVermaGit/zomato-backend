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
exports.OrderStateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let OrderStateService = class OrderStateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transition(orderId, toStatus, userId, role, reason, deliveryPartnerId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        this.authorizeTransition(role, toStatus, order, userId);
        this.validateTransition(order.status, toStatus);
        const data = { status: toStatus };
        const now = new Date();
        switch (toStatus) {
            case client_1.OrderStatus.ACCEPTED:
                data.acceptedAt = now;
                break;
            case client_1.OrderStatus.PREPARING:
                data.preparingAt = now;
                break;
            case client_1.OrderStatus.READY:
                data.readyAt = now;
                break;
            case client_1.OrderStatus.PICKED_UP:
                data.pickedUpAt = now;
                break;
            case client_1.OrderStatus.OUT_FOR_DELIVERY:
                break;
            case client_1.OrderStatus.DELIVERED:
                data.deliveredAt = now;
                data.paymentStatus = 'COMPLETED';
                break;
            case client_1.OrderStatus.CANCELLED:
                data.cancelledAt = now;
                break;
        }
        if (deliveryPartnerId) {
            data.deliveryPartnerId = deliveryPartnerId;
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data
        });
    }
    async assignPartner(orderId, deliveryPartnerId) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { id: deliveryPartnerId } });
        if (!partner)
            throw new common_1.NotFoundException('Delivery Partner not found');
        return this.prisma.order.update({
            where: { id: orderId },
            data: { deliveryPartnerId }
        });
    }
    authorizeTransition(role, toStatus, order, userId) {
        if (role === client_1.UserRole.ADMIN)
            return;
        switch (role) {
            case client_1.UserRole.RESTAURANT_PARTNER:
                if ([client_1.OrderStatus.ACCEPTED, client_1.OrderStatus.PREPARING, client_1.OrderStatus.READY].includes(toStatus)) {
                    return;
                }
                if (toStatus === client_1.OrderStatus.CANCELLED) {
                    if (order.status === client_1.OrderStatus.PICKED_UP || order.status === client_1.OrderStatus.DELIVERED) {
                        throw new common_1.ForbiddenException('Cannot cancel after pickup');
                    }
                    return;
                }
                break;
            case client_1.UserRole.DELIVERY_PARTNER:
                if ([client_1.OrderStatus.PICKED_UP, client_1.OrderStatus.DELIVERED].includes(toStatus)) {
                    if (order.deliveryPartnerId !== userId && order.deliveryPartnerId !== null) {
                    }
                    return;
                }
                break;
            case client_1.UserRole.CUSTOMER:
                if (toStatus === client_1.OrderStatus.CANCELLED) {
                    if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.ACCEPTED) {
                        throw new common_1.ForbiddenException('Cannot cancel after preparation started');
                    }
                    if (order.customerId !== userId)
                        throw new common_1.ForbiddenException('Not your order');
                    return;
                }
                break;
        }
        throw new common_1.ForbiddenException(`Role ${role} cannot transition to ${toStatus}`);
    }
    validateTransition(current, next) {
        if (current === next)
            return;
        if (current === client_1.OrderStatus.CANCELLED || current === client_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException(`Order is already ${current}`);
        }
        const map = {
            [client_1.OrderStatus.PENDING]: [client_1.OrderStatus.ACCEPTED, client_1.OrderStatus.CANCELLED],
            [client_1.OrderStatus.ACCEPTED]: [client_1.OrderStatus.PREPARING, client_1.OrderStatus.CANCELLED],
            [client_1.OrderStatus.PREPARING]: [client_1.OrderStatus.READY, client_1.OrderStatus.CANCELLED],
            [client_1.OrderStatus.READY]: [client_1.OrderStatus.PICKED_UP, client_1.OrderStatus.CANCELLED],
            [client_1.OrderStatus.PICKED_UP]: [client_1.OrderStatus.OUT_FOR_DELIVERY, client_1.OrderStatus.DELIVERED],
            [client_1.OrderStatus.OUT_FOR_DELIVERY]: [client_1.OrderStatus.DELIVERED]
        };
        const allowed = map[current] || [];
        if (!allowed.includes(next)) {
            throw new common_1.BadRequestException(`Invalid transition from ${current} to ${next}`);
        }
    }
};
exports.OrderStateService = OrderStateService;
exports.OrderStateService = OrderStateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderStateService);
//# sourceMappingURL=order-state.service.js.map