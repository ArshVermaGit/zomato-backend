import { Injectable } from '@nestjs/common';
import { RoutingService } from './routing.service';

@Injectable()
export class ETAService {
    constructor(private routingService: RoutingService) { }

    async calculateETA(origin: { lat: number, lng: number }, destination: { lat: number, lng: number }) {
        const { duration, distance } = await this.routingService.getDistance(origin, destination);

        // Add buffer logic (e.g. preparation time if relevant, or traffic buffer)
        // For now, just return raw driving duration + 5 mins buffer
        const buffer = 300; // 5 mins in seconds
        const totalSeconds = duration + buffer;

        return {
            etaSeconds: totalSeconds,
            etaMinutes: Math.round(totalSeconds / 60),
            distanceMeters: distance
        };
    }
}
