import { GeocodingService } from './geocoding.service';
import { RoutingService } from './routing.service';
import { ETAService } from './eta.service';
export declare class MapsService {
    private geocoding;
    private routing;
    private eta;
    constructor(geocoding: GeocodingService, routing: RoutingService, eta: ETAService);
    geocodeAddress(address: string): Promise<{
        lat: number;
        lng: number;
        formattedAddress: string;
    }>;
    reverseGeocode(lat: number, lng: number): Promise<string>;
    calculateDistance(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): Promise<{
        distance: number;
        duration: number;
    }>;
    getRoute(origin: string, destination: string): Promise<{
        polyline: string;
        summary: string;
        legs?: undefined;
    } | {
        polyline: string;
        summary: string;
        legs: import("@googlemaps/google-maps-services-js").RouteLeg[];
    }>;
    getETA(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): Promise<{
        etaSeconds: number;
        etaMinutes: number;
        distanceMeters: number;
    }>;
    getNearbyRestaurants(lat: number, lng: number, radius?: number): Promise<never[]>;
}
