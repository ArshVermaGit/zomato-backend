import { GeocodingService } from './geocoding.service';
import { RoutingService } from './routing.service';
import { ETAService } from './eta.service';
export declare class MapsService {
    private geocoding;
    private routing;
    private eta;
    constructor(geocoding: GeocodingService, routing: RoutingService, eta: ETAService);
    geocodeAddress(address: string): unknown;
    reverseGeocode(lat: number, lng: number): unknown;
    calculateDistance(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): unknown;
    getRoute(origin: string, destination: string): unknown;
    getETA(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): unknown;
    getNearbyRestaurants(_lat: number, _lng: number, _radius?: number): never[];
}
