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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ws_auth_middleware_1 = require("./ws-auth.middleware");
let OrdersGateway = class OrdersGateway {
    jwtService;
    configService;
    server;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    handleConnection(client) {
        const auth = new ws_auth_middleware_1.WsAuthMiddleware(this.jwtService, this.configService);
        const user = auth.validate(client);
        if (!user) {
            client.disconnect();
            return;
        }
        client.data.user = user;
        console.log(`Client connected to Orders: ${client.id}, User: ${user.userId}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected from Orders: ${client.id}`);
    }
    handleJoinRoom(orderId, client) {
        client.join(`order_${orderId}`);
        console.log(`User ${client.data.user.userId} joined order_${orderId}`);
        return { event: 'joined_room', data: { orderId } };
    }
    handleLeaveRoom(orderId, client) {
        client.leave(`order_${orderId}`);
        return { event: 'left_room', data: { orderId } };
    }
    emitOrderStatusUpdate(orderId, status, data) {
        this.server.to(`order_${orderId}`).emit('order.status_changed', { orderId, status, ...data });
    }
    emitOrderAssigned(orderId, partnerId) {
        this.server.to(`order_${orderId}`).emit('order.assigned', { orderId, partnerId });
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_order_room'),
    __param(0, (0, websockets_1.MessageBody)('orderId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_order_room'),
    __param(0, (0, websockets_1.MessageBody)('orderId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleLeaveRoom", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'orders'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map