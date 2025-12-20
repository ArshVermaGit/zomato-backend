import { MapsService } from './maps.service';
export declare class MapsController {
    private mapsService;
    constructor(mapsService: MapsService);
    geocode(address: string): Promise<{
        lat: number;
        lng: number;
        formattedAddress: string;
    }>;
    reverseGeocode(body: {
        lat: number;
        lng: number;
    }): Promise<string>;
    getDistance(body: {
        origin: {
            lat: number;
            lng: number;
        };
        destination: {
            lat: number;
            lng: number;
        };
    }): Promise<{
        distance: number;
        duration: number;
    }>;
    getRoute(body: {
        origin: string;
        destination: string;
    }): Promise<{
        polyline: string;
        summary: string;
        legs?: undefined;
    } | {
        polyline: string;
        summary: string;
        legs: import("@googlemaps/google-maps-services-js").RouteLeg[];
    }>;
    getETA(body: {
        origin: {
            lat: number;
            lng: number;
        };
        destination: {
            lat: number;
            lng: number;
        };
    }): Promise<{
        etaSeconds: number;
        etaMinutes: number;
        distanceMeters: number;
    }>;
    getNearbyRestaurants(lat: number, lng: number, radius: number): never[];
}
