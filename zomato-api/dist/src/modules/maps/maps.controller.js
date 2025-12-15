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
exports.MapsController = void 0;
const common_1 = require("@nestjs/common");
const maps_service_1 = require("./maps.service");
const swagger_1 = require("@nestjs/swagger");
let MapsController = class MapsController {
    mapsService;
    constructor(mapsService) {
        this.mapsService = mapsService;
    }
    async geocode(address) {
        return this.mapsService.geocodeAddress(address);
    }
    async reverseGeocode(body) {
        return this.mapsService.reverseGeocode(body.lat, body.lng);
    }
    async getDistance(body) {
        return this.mapsService.calculateDistance(body.origin, body.destination);
    }
    async getRoute(body) {
        return this.mapsService.getRoute(body.origin, body.destination);
    }
    async getETA(body) {
        return this.mapsService.getETA(body.origin, body.destination);
    }
    async getNearbyRestaurants(lat, lng, radius) {
        return this.mapsService.getNearbyRestaurants(Number(lat), Number(lng), Number(radius || 5000));
    }
};
exports.MapsController = MapsController;
__decorate([
    (0, common_1.Post)('geocode'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert address to coordinates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coordinates returned' }),
    __param(0, (0, common_1.Body)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "geocode", null);
__decorate([
    (0, common_1.Post)('reverse-geocode'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert coordinates to address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Address returned' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "reverseGeocode", null);
__decorate([
    (0, common_1.Post)('distance'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate distance between two points' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distance details' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "getDistance", null);
__decorate([
    (0, common_1.Post)('route'),
    (0, swagger_1.ApiOperation)({ summary: 'Get route polyline and directions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Routing details' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "getRoute", null);
__decorate([
    (0, common_1.Post)('eta'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ETA including buffer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ETA details' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "getETA", null);
__decorate([
    (0, common_1.Get)('nearby-restaurants'),
    (0, swagger_1.ApiOperation)({ summary: 'Find restaurants near location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of nearby restaurants' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "getNearbyRestaurants", null);
exports.MapsController = MapsController = __decorate([
    (0, swagger_1.ApiTags)('Maps'),
    (0, common_1.Controller)('maps'),
    __metadata("design:paramtypes", [maps_service_1.MapsService])
], MapsController);
//# sourceMappingURL=maps.controller.js.map