import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private mapsService: MapsService) {}

  @Post('geocode')
  @ApiOperation({ summary: 'Convert address to coordinates' })
  @ApiResponse({ status: 200, description: 'Coordinates returned' })
  async geocode(@Body('address') address: string) {
    return this.mapsService.geocodeAddress(address);
  }

  @Post('reverse-geocode')
  @ApiOperation({ summary: 'Convert coordinates to address' })
  @ApiResponse({ status: 200, description: 'Address returned' })
  async reverseGeocode(@Body() body: { lat: number; lng: number }) {
    return this.mapsService.reverseGeocode(body.lat, body.lng);
  }

  @Post('distance')
  @ApiOperation({ summary: 'Calculate distance between two points' })
  @ApiResponse({ status: 200, description: 'Distance details' })
  async getDistance(
    @Body()
    body: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
    },
  ) {
    return this.mapsService.calculateDistance(body.origin, body.destination);
  }

  @Post('route')
  @ApiOperation({ summary: 'Get route polyline and directions' })
  @ApiResponse({ status: 200, description: 'Routing details' })
  async getRoute(@Body() body: { origin: string; destination: string }) {
    return this.mapsService.getRoute(body.origin, body.destination);
  }

  @Post('eta')
  @ApiOperation({ summary: 'Get ETA including buffer' })
  @ApiResponse({ status: 200, description: 'ETA details' })
  async getETA(
    @Body()
    body: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
    },
  ) {
    return this.mapsService.getETA(body.origin, body.destination);
  }

  @Get('nearby-restaurants')
  @ApiOperation({ summary: 'Find restaurants near location' })
  @ApiResponse({ status: 200, description: 'List of nearby restaurants' })
  getNearbyRestaurants(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number,
  ) {
    return this.mapsService.getNearbyRestaurants(
      Number(lat),
      Number(lng),
      Number(radius || 5000),
    );
  }
}
