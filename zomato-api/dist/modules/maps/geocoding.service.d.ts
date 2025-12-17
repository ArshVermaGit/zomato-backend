import { ConfigService } from '@nestjs/config';
export declare class GeocodingService {
    private configService;
    private client;
    private apiKey;
    constructor(configService: ConfigService);
    geocode(address: string): unknown;
    reverseGeocode(lat: number, lng: number): unknown;
}
