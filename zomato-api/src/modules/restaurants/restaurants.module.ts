import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { WebsocketsModule } from '../websockets/websockets.module';
import { MapsModule } from '../maps/maps.module';

@Module({
    imports: [WebsocketsModule, MapsModule],
    controllers: [RestaurantsController],
    providers: [RestaurantsService],
    exports: [RestaurantsService],
})
export class RestaurantsModule { }
