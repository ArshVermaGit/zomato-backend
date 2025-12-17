import { RoutingService } from './routing.service';
export declare class ETAService {
    private routingService;
    constructor(routingService: RoutingService);
    calculateETA(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): unknown;
}
