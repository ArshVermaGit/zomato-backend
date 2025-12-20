import { Module } from '@nestjs/common';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { GeocodingService } from './geocoding.service';
import { RoutingService } from './routing.service';
import { ETAService } from './eta.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MapsController],
  providers: [MapsService, GeocodingService, RoutingService, ETAService],
  exports: [MapsService, ETAService],
})
export class MapsModule {}
