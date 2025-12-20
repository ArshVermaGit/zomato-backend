import { Injectable } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { RoutingService } from './routing.service';
import { ETAService } from './eta.service';

@Injectable()
export class MapsService {
  constructor(
    private geocoding: GeocodingService,
    private routing: RoutingService,
    private eta: ETAService,
  ) {}

  async geocodeAddress(address: string) {
    return this.geocoding.geocode(address);
  }

  async reverseGeocode(lat: number, lng: number) {
    return this.geocoding.reverseGeocode(lat, lng);
  }

  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    return this.routing.getDistance(origin, destination);
  }

  async getRoute(origin: string, destination: string) {
    return this.routing.getRoute(origin, destination);
  }

  async getETA(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    return this.eta.calculateETA(origin, destination);
  }

  getNearbyRestaurants(_lat: number, _lng: number, _radius: number = 5000) {
    // Placeholder: Ideally queries PostGIS/MongoDB or Google Places API
    // For now, return mock empty or integrate with RestaurantsModule later
    return [];
  }
}
