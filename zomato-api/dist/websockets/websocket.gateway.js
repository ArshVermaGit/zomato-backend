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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
function calculateDistance(loc1, loc2) {
    if (!loc1 || !loc2)
        return 0;
    const R = 6371;
    const dLat = deg2rad(loc2.lat - loc1.lat);
    const dLon = deg2rad(loc2.lng - loc1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(loc1.lat)) * Math.cos(deg2rad(loc2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Number(d.toFixed(2));
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
let RealtimeGateway = class RealtimeGateway {
    jwtService;
    server;
    connectedUsers = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            this.connectedUsers.set(client.id, {
                socketId: client.id,
                userId: payload.sub,
                role: payload.role,
            });
            client.join(`user:${payload.sub}`);
            client.join(`role:${payload.role}`);
            console.log(`✅ User ${payload.sub} (${payload.role}) connected - Socket: ${client.id}`);
        }
        catch (error) {
            console.error('❌ WebSocket authentication failed:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            console.log(`❌ User ${user.userId} (${user.role}) disconnected`);
            this.connectedUsers.delete(client.id);
        }
    }
    emitToCustomer(userId, event, data) {
        this.server.to(`user:${userId}`).emit(event, data);
    }
    emitToRestaurant(restaurantId, event, data) {
        this.server.to(`restaurant:${restaurantId}`).emit(event, data);
    }
    emitToDeliveryPartner(partnerId, event, data) {
        this.server.to(`user:${partnerId}`).emit(event, data);
    }
    emitToAvailableDeliveryPartners(location, event, data) {
        this.server.to('role:DELIVERY_PARTNER').emit(event, data);
    }
    emitToAdmins(event, data) {
        this.server.to('role:ADMIN').emit(event, data);
    }
    notifyNewOrder(order) {
        this.emitToRestaurant(order.restaurantId, 'order:new', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            items: order.items,
            totalAmount: order.totalAmount,
            customerName: order.customer.name,
            placedAt: order.placedAt,
        });
        this.emitToAdmins('order:created', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            restaurant: order.restaurant.name,
            totalAmount: order.totalAmount,
        });
    }
    notifyOrderAccepted(order) {
        this.emitToCustomer(order.customerId, 'order:accepted', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            estimatedTime: order.estimatedDeliveryTime,
            restaurant: order.restaurant.name,
        });
    }
    notifyOrderReady(order) {
        this.emitToAvailableDeliveryPartners(order.restaurant.location, 'order:available', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            restaurant: {
                name: order.restaurant.name,
                location: order.restaurant.location,
            },
            deliveryLocation: order.deliveryAddress,
            earnings: order.deliveryFee * 0.8,
            distance: calculateDistance(order.restaurant.location, order.deliveryAddress),
        });
    }
    notifyDeliveryPartnerAssigned(order) {
        this.emitToCustomer(order.customerId, 'order:delivery_partner_assigned', {
            orderId: order.id,
            deliveryPartner: {
                name: order.deliveryPartner.user.name,
                phone: order.deliveryPartner.user.phone,
                vehicleType: order.deliveryPartner.vehicleType,
                rating: order.deliveryPartner.rating,
            },
        });
        this.emitToRestaurant(order.restaurantId, 'order:delivery_partner_assigned', {
            orderId: order.id,
            deliveryPartner: order.deliveryPartner.user.name,
        });
    }
    notifyLocationUpdate(orderId, customerId, location) {
        this.emitToCustomer(customerId, 'delivery:location_update', {
            orderId,
            location,
            timestamp: new Date(),
        });
    }
    notifyOrderDelivered(order) {
        this.emitToCustomer(order.customerId, 'order:delivered', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            deliveredAt: order.deliveredAt,
        });
        this.emitToRestaurant(order.restaurantId, 'order:completed', {
            orderId: order.id,
            orderNumber: order.orderNumber,
        });
    }
    notifyRestaurantStatusChanged(restaurantId, isOpen) {
        this.emitToAdmins('restaurant:status_changed', {
            restaurantId,
            isOpen,
            timestamp: new Date(),
        });
    }
    notifyMenuUpdated(restaurantId) {
        this.server.emit('menu:updated', {
            restaurantId,
            timestamp: new Date(),
        });
    }
    handleMessage(client, data) {
        this.emitToCustomer(data.recipientId, 'message:received', {
            orderId: data.orderId,
            message: data.message,
            senderId: this.connectedUsers.get(client.id)?.userId,
            timestamp: new Date(),
        });
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleMessage", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/realtime',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], RealtimeGateway);
//# sourceMappingURL=websocket.gateway.js.map