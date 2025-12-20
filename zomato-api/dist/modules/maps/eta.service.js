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
exports.ETAService = void 0;
const common_1 = require("@nestjs/common");
const routing_service_1 = require("./routing.service");
let ETAService = class ETAService {
    routingService;
    constructor(routingService) {
        this.routingService = routingService;
    }
    async calculateETA(origin, destination) {
        const { duration, distance } = await this.routingService.getDistance(origin, destination);
        const buffer = 300;
        const totalSeconds = duration + buffer;
        return {
            etaSeconds: totalSeconds,
            etaMinutes: Math.round(totalSeconds / 60),
            distanceMeters: distance,
        };
    }
};
exports.ETAService = ETAService;
exports.ETAService = ETAService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [routing_service_1.RoutingService])
], ETAService);
//# sourceMappingURL=eta.service.js.map