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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ws_auth_middleware_1 = require("./ws-auth.middleware");
let DeliveryGateway = class DeliveryGateway {
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
        console.log(`Client connected to Delivery: ${client.id}, User: ${user.userId}`);
    }
    handleDisconnect(_client) { }
    handleLocationUpdate(data, _client) {
        const user = _client.data.user;
        if (data.orderId) {
            this.server
                .to(`tracking_${data.orderId}`)
                .emit('delivery.location_update', {
                partnerId: user.userId,
                lat: data.lat,
                lng: data.lng,
            });
        }
    }
    async handleJoinRoom(orderId, client) {
        await client.join(`tracking_${orderId}`);
    }
};
exports.DeliveryGateway = DeliveryGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DeliveryGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('update_location'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DeliveryGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_delivery_room'),
    __param(0, (0, websockets_1.MessageBody)('orderId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], DeliveryGateway.prototype, "handleJoinRoom", null);
exports.DeliveryGateway = DeliveryGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'delivery',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], DeliveryGateway);
//# sourceMappingURL=delivery.gateway.js.map