"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_controller_1 = require("./delivery.controller");
const delivery_service_1 = require("./delivery.service");
const location_service_1 = require("./location.service");
const orders_module_1 = require("../orders/orders.module");
const earnings_service_1 = require("./earnings.service");
let DeliveryModule = class DeliveryModule {
};
exports.DeliveryModule = DeliveryModule;
exports.DeliveryModule = DeliveryModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => orders_module_1.OrdersModule)],
        controllers: [delivery_controller_1.DeliveryController],
        providers: [delivery_service_1.DeliveryService, location_service_1.LocationService, earnings_service_1.EarningsService],
        exports: [delivery_service_1.DeliveryService, location_service_1.LocationService, earnings_service_1.EarningsService],
    })
], DeliveryModule);
//# sourceMappingURL=delivery.module.js.map