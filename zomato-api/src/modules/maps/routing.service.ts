import { Injectable } from '@nestjs/common';
import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoutingService {
  private client: Client;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.client = new Client({});
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') || '';
  }

  async getDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    if (!this.apiKey) return { distance: 5000, duration: 600 }; // 5km, 10 mins

    try {
      const response = await this.client.distancematrix({
        params: {
          origins: [{ lat: origin.lat, lng: origin.lng }],
          destinations: [{ lat: destination.lat, lng: destination.lng }],
          key: this.apiKey,
          mode: TravelMode.driving,
        },
      });
      const element = response.data.rows[0].elements[0];
      return {
        distance: element.distance.value, // in meters
        duration: element.duration.value, // in seconds
      };
    } catch (error) {
      console.error('Distance Matrix Error:', error);
      throw new Error('Failed to calculate distance');
    }
  }

  async getRoute(
    origin: string,
    destination: string,
    waypoints: string[] = [],
  ) {
    if (!this.apiKey)
      return { polyline: 'mock_polyline', summary: 'Mock Route' };

    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          waypoints,
          mode: TravelMode.driving,
          key: this.apiKey,
        },
      });
      const route = response.data.routes[0];
      return {
        polyline: route.overview_polyline.points,
        summary: route.summary,
        legs: route.legs,
      };
    } catch (error) {
      console.error('Directions Error:', error);
      throw new Error('Failed to get route');
    }
  }
}
