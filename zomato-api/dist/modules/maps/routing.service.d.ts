import { ConfigService } from '@nestjs/config';
export declare class RoutingService {
    private configService;
    private client;
    private apiKey;
    constructor(configService: ConfigService);
    getDistance(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): unknown;
    getRoute(origin: string, destination: string, waypoints?: string[]): unknown;
}
