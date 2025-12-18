"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationModule = void 0;
const common_1 = require("@nestjs/common");
const location_service_1 = require("./location.service");
const location_gateway_1 = require("./location.gateway");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let LocationModule = class LocationModule {
};
exports.LocationModule = LocationModule;
exports.LocationModule = LocationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [location_service_1.LocationService, location_gateway_1.LocationGateway],
        exports: [location_service_1.LocationService]
    })
], LocationModule);
//# sourceMappingURL=location.module.js.map