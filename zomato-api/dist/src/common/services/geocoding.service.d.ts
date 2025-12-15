import { ConfigService } from '@nestjs/config';
export declare class GeocodingService {
    private configService;
    private client;
    constructor(configService: ConfigService);
    getCoordinates(address: string): Promise<{
        lat: number;
        lng: number;
    } | null>;
}
