import { RedisService } from '@liaoliaots/nestjs-redis';
export declare class LocationService {
    private readonly redisService;
    private readonly GEO_KEY;
    private readonly redis;
    constructor(redisService: RedisService);
    updateLocation(userId: string, lat: number, lng: number): any;
    getDriverLocation(userId: string): unknown;
    findNearbyDrivers(lat: number, lng: number, radiusKm: number): unknown;
    removeDriver(userId: string): any;
}
