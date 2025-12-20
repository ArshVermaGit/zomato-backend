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
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const config_1 = require("@nestjs/config");
let RoutingService = class RoutingService {
    configService;
    client;
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.client = new google_maps_services_js_1.Client({});
        this.apiKey = this.configService.get('GOOGLE_MAPS_API_KEY') || '';
    }
    async getDistance(origin, destination) {
        if (!this.apiKey)
            return { distance: 5000, duration: 600 };
        try {
            const response = await this.client.distancematrix({
                params: {
                    origins: [{ lat: origin.lat, lng: origin.lng }],
                    destinations: [{ lat: destination.lat, lng: destination.lng }],
                    key: this.apiKey,
                    mode: google_maps_services_js_1.TravelMode.driving,
                },
            });
            const element = response.data.rows[0].elements[0];
            return {
                distance: element.distance.value,
                duration: element.duration.value,
            };
        }
        catch (error) {
            console.error('Distance Matrix Error:', error);
            throw new Error('Failed to calculate distance');
        }
    }
    async getRoute(origin, destination, waypoints = []) {
        if (!this.apiKey)
            return { polyline: 'mock_polyline', summary: 'Mock Route' };
        try {
            const response = await this.client.directions({
                params: {
                    origin,
                    destination,
                    waypoints,
                    mode: google_maps_services_js_1.TravelMode.driving,
                    key: this.apiKey,
                },
            });
            const route = response.data.routes[0];
            return {
                polyline: route.overview_polyline.points,
                summary: route.summary,
                legs: route.legs,
            };
        }
        catch (error) {
            console.error('Directions Error:', error);
            throw new Error('Failed to get route');
        }
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RoutingService);
//# sourceMappingURL=routing.service.js.map