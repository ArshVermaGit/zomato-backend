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
    }): Promise<{
        distance: number;
        duration: number;
    }>;
    getRoute(origin: string, destination: string, waypoints?: string[]): Promise<{
        polyline: string;
        summary: string;
        legs?: undefined;
    } | {
        polyline: string;
        summary: string;
        legs: import("@googlemaps/google-maps-services-js").RouteLeg[];
    }>;
}
