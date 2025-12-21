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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const location_service_1 = require("./location.service");
const ws_auth_middleware_1 = require("../websockets/ws-auth.middleware");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let LocationGateway = class LocationGateway {
    locationService;
    jwtService;
    configService;
    server;
    constructor(locationService, jwtService, configService) {
        this.locationService = locationService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    handleConnection(client) {
        const auth = new ws_auth_middleware_1.WsAuthMiddleware(this.jwtService, this.configService);
        const user = auth.validate(client);
        if (!user)
            return client.disconnect();
        client.data.user = user;
    }
    async handleLocationUpdate(data, client) {
        const driverId = client.data.user.userId;
        await this.locationService.updateDriverLocation(driverId, data.lat, data.lng);
        if (data.orderId) {
            this.server.to(`order_${data.orderId}`).emit('driverLocationUpdate', {
                driverId,
                lat: data.lat,
                lng: data.lng,
                timestamp: Date.now(),
            });
        }
    }
    handleTrackOrder(orderId, client) {
        client.join(`order_${orderId}`);
        console.log(`Client ${client.id} joined tracking for order ${orderId}`);
    }
};
exports.LocationGateway = LocationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LocationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateLocation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], LocationGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('trackOrder'),
    __param(0, (0, websockets_1.MessageBody)('orderId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "handleTrackOrder", null);
exports.LocationGateway = LocationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'location',
    }),
    __metadata("design:paramtypes", [location_service_1.LocationService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, config_1.ConfigService])
], LocationGateway);
//# sourceMappingURL=location.gateway.js.map