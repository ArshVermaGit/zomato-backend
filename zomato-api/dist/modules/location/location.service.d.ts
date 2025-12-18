import Redis from 'ioredis';
export declare class LocationService {
    private readonly redis;
    constructor(redis: Redis);
    updateDriverLocation(driverId: string, lat: number, lng: number): Promise<{
        success: boolean;
    }>;
    getDriverLocation(driverId: string): Promise<any>;
}
