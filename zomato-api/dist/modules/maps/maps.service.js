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
exports.MapsService = void 0;
const common_1 = require("@nestjs/common");
const geocoding_service_1 = require("./geocoding.service");
const routing_service_1 = require("./routing.service");
const eta_service_1 = require("./eta.service");
let MapsService = class MapsService {
    geocoding;
    routing;
    eta;
    constructor(geocoding, routing, eta) {
        this.geocoding = geocoding;
        this.routing = routing;
        this.eta = eta;
    }
    async geocodeAddress(address) {
        return this.geocoding.geocode(address);
    }
    async reverseGeocode(lat, lng) {
        return this.geocoding.reverseGeocode(lat, lng);
    }
    async calculateDistance(origin, destination) {
        return this.routing.getDistance(origin, destination);
    }
    async getRoute(origin, destination) {
        return this.routing.getRoute(origin, destination);
    }
    async getETA(origin, destination) {
        return this.eta.calculateETA(origin, destination);
    }
    getNearbyRestaurants(_lat, _lng, _radius = 5000) {
        return [];
    }
};
exports.MapsService = MapsService;
exports.MapsService = MapsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [geocoding_service_1.GeocodingService,
        routing_service_1.RoutingService,
        eta_service_1.ETAService])
], MapsService);
//# sourceMappingURL=maps.service.js.map