import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeocodingService {
  private client: Client;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.client = new Client({});
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') || '';
  }

  async geocode(address: string) {
    if (!this.apiKey)
      return { lat: 0, lng: 0, formattedAddress: 'Mock Address, City' };

    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });
      const location = response.data.results[0]?.geometry.location;
      const formattedAddress = response.data.results[0]?.formatted_address;
      return { lat: location.lat, lng: location.lng, formattedAddress };
    } catch (error) {
      console.error('Geocoding Error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async reverseGeocode(lat: number, lng: number) {
    if (!this.apiKey) return 'Mock Address for ' + lat + ',' + lng;

    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: this.apiKey,
        },
      });
      return response.data.results[0]?.formatted_address;
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
      throw new Error('Failed to reverse geocode');
    }
  }
}
