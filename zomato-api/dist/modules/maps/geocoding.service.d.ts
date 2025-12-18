import { ConfigService } from '@nestjs/config';
export declare class GeocodingService {
    private configService;
    private client;
    private apiKey;
    constructor(configService: ConfigService);
    geocode(address: string): Promise<{
        lat: number;
        lng: number;
        formattedAddress: string;
    }>;
    reverseGeocode(lat: number, lng: number): Promise<string>;
}
