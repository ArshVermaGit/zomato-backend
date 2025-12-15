import { RedisService } from '@liaoliaots/nestjs-redis';
export declare class LocationService {
    private readonly redisService;
    private readonly GEO_KEY;
    private readonly redis;
    constructor(redisService: RedisService);
    updateLocation(userId: string, lat: number, lng: number): Promise<void>;
    getDriverLocation(userId: string): Promise<{
        lng: string;
        lat: string;
    } | null>;
    findNearbyDrivers(lat: number, lng: number, radiusKm: number): Promise<{
        userId: any;
        distance: number;
        location: {
            lng: number;
            lat: number;
        };
    }[]>;
    removeDriver(userId: string): Promise<void>;
}
