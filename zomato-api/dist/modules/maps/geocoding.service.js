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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const config_1 = require("@nestjs/config");
let GeocodingService = class GeocodingService {
    configService;
    client;
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.client = new google_maps_services_js_1.Client({});
        this.apiKey = this.configService.get('GOOGLE_MAPS_API_KEY') || '';
    }
    async geocode(address) {
        if (!this.apiKey)
            return { lat: 0, lng: 0, formattedAddress: 'Mock Address, City' };
        try {
            const response = await this.client.geocode({
                params: {
                    address,
                    key: this.apiKey
                }
            });
            const location = response.data.results[0]?.geometry.location;
            const formattedAddress = response.data.results[0]?.formatted_address;
            return { lat: location.lat, lng: location.lng, formattedAddress };
        }
        catch (error) {
            console.error('Geocoding Error:', error);
            throw new Error('Failed to geocode address');
        }
    }
    async reverseGeocode(lat, lng) {
        if (!this.apiKey)
            return 'Mock Address for ' + lat + ',' + lng;
        try {
            const response = await this.client.reverseGeocode({
                params: {
                    latlng: { lat, lng },
                    key: this.apiKey
                }
            });
            return response.data.results[0]?.formatted_address;
        }
        catch (error) {
            console.error('Reverse Geocoding Error:', error);
            throw new Error('Failed to reverse geocode');
        }
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map