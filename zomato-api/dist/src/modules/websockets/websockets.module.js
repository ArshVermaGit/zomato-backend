"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketsModule = void 0;
const common_1 = require("@nestjs/common");
const orders_gateway_1 = require("./orders.gateway");
const delivery_gateway_1 = require("./delivery.gateway");
const chat_gateway_1 = require("./chat.gateway");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let WebsocketsModule = class WebsocketsModule {
};
exports.WebsocketsModule = WebsocketsModule;
exports.WebsocketsModule = WebsocketsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        providers: [orders_gateway_1.OrdersGateway, delivery_gateway_1.DeliveryGateway, chat_gateway_1.ChatGateway],
        exports: [orders_gateway_1.OrdersGateway, delivery_gateway_1.DeliveryGateway, chat_gateway_1.ChatGateway],
    })
], WebsocketsModule);
//# sourceMappingURL=websockets.module.js.map