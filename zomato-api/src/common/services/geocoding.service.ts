import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GeocodingService {
    private client: Client;

    constructor(private configService: ConfigService) {
        this.client = new Client({});
    }

    async getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
        try {
            const response = await this.client.geocode({
                params: {
                    address,
                    key: this.configService.get<string>('GOOGLE_MAPS_API_KEY') || '',
                },
            });

            if (response.data.results.length > 0) {
                return response.data.results[0].geometry.location;
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
}
