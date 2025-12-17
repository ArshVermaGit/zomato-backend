"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsModule = void 0;
const common_1 = require("@nestjs/common");
const maps_controller_1 = require("./maps.controller");
const maps_service_1 = require("./maps.service");
const geocoding_service_1 = require("./geocoding.service");
const routing_service_1 = require("./routing.service");
const eta_service_1 = require("./eta.service");
const config_1 = require("@nestjs/config");
let MapsModule = class MapsModule {
};
exports.MapsModule = MapsModule;
exports.MapsModule = MapsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [maps_controller_1.MapsController],
        providers: [
            maps_service_1.MapsService,
            geocoding_service_1.GeocodingService,
            routing_service_1.RoutingService,
            eta_service_1.ETAService
        ],
        exports: [maps_service_1.MapsService, eta_service_1.ETAService]
    })
], MapsModule);
//# sourceMappingURL=maps.module.js.map