import Redis from 'ioredis';
export declare class LocationService {
    private readonly redis;
    constructor(redis: Redis);
    updateDriverLocation(driverId: string, lat: number, lng: number): unknown;
    getDriverLocation(driverId: string): unknown;
}
