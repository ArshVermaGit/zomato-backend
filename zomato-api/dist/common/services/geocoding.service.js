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
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
let GeocodingService = class GeocodingService {
    configService;
    client;
    constructor(configService) {
        this.configService = configService;
        this.client = new google_maps_services_js_1.Client({});
    }
    async getCoordinates(address) {
        try {
            const response = await this.client.geocode({
                params: {
                    address,
                    key: this.configService.get('GOOGLE_MAPS_API_KEY') || '',
                },
            });
            if (response.data.results.length > 0) {
                return response.data.results[0].geometry.location;
            }
            return null;
        }
        catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map