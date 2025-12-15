import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class LocationService {
    private readonly GEO_KEY = 'delivery_partners:locations';
    private readonly redis: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getOrThrow();
    }

    async updateLocation(userId: string, lat: number, lng: number) {
        // GEOADD key longitude latitude member
        await this.redis.geoadd(this.GEO_KEY, lng, lat, userId);
        // Set expiry for the member if possible? No, GEO doesn't support member expiry directly in older redis.
        // Ideally we might want to remove stale drivers, but for MVP we overwrite.
    }

    async getDriverLocation(userId: string) {
        // GEOPOS key member
        const pos = await this.redis.geopos(this.GEO_KEY, userId);
        if (!pos || !pos[0]) return null;
        return { lng: pos[0][0], lat: pos[0][1] };
    }

    async findNearbyDrivers(lat: number, lng: number, radiusKm: number) {
        // GEORADIUS key longitude latitude radius m|km|ft|mi WITHDIST WITHCOORD
        // Returns [[member, distance, [lng, lat]]]
        const drivers = await this.redis.georadius(
            this.GEO_KEY,
            lng,
            lat,
            radiusKm,
            'km',
            'WITHDIST',
            'WITHCOORD'
        );

        // Map to cleaner objects
        return drivers.map((d: any) => ({
            userId: d[0],
            distance: parseFloat(d[1]),
            location: { lng: parseFloat(d[2][0]), lat: parseFloat(d[2][1]) }
        }));
    }

    async removeDriver(userId: string) {
        await this.redis.zrem(this.GEO_KEY, userId);
    }
}
