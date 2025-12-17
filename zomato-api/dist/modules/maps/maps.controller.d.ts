import { MapsService } from './maps.service';
export declare class MapsController {
    private mapsService;
    constructor(mapsService: MapsService);
    geocode(address: string): unknown;
    reverseGeocode(body: {
        lat: number;
        lng: number;
    }): unknown;
    getDistance(body: {
        origin: {
            lat: number;
            lng: number;
        };
        destination: {
            lat: number;
            lng: number;
        };
    }): unknown;
    getRoute(body: {
        origin: string;
        destination: string;
    }): unknown;
    getETA(body: {
        origin: {
            lat: number;
            lng: number;
        };
        destination: {
            lat: number;
            lng: number;
        };
    }): unknown;
    getNearbyRestaurants(lat: number, lng: number, radius: number): unknown;
}
