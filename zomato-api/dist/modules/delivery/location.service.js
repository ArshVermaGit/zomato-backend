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
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
let LocationService = class LocationService {
    redisService;
    GEO_KEY = 'delivery_partners:locations';
    redis;
    constructor(redisService) {
        this.redisService = redisService;
        this.redis = this.redisService.getOrThrow();
    }
    async updateLocation(userId, lat, lng) {
        await this.redis.geoadd(this.GEO_KEY, lng, lat, userId);
    }
    async getDriverLocation(userId) {
        const pos = await this.redis.geopos(this.GEO_KEY, userId);
        if (!pos || !pos[0])
            return null;
        return { lng: pos[0][0], lat: pos[0][1] };
    }
    async findNearbyDrivers(lat, lng, radiusKm) {
        const drivers = await this.redis.georadius(this.GEO_KEY, lng, lat, radiusKm, 'km', 'WITHDIST', 'WITHCOORD');
        return drivers.map((d) => ({
            userId: d[0],
            distance: parseFloat(d[1]),
            location: { lng: parseFloat(d[2][0]), lat: parseFloat(d[2][1]) }
        }));
    }
    async removeDriver(userId) {
        await this.redis.zrem(this.GEO_KEY, userId);
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof nestjs_redis_1.RedisService !== "undefined" && nestjs_redis_1.RedisService) === "function" ? _a : Object])
], LocationService);
//# sourceMappingURL=location.service.js.map