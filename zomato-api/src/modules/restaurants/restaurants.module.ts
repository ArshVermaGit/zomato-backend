import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { WebsocketsModule } from '../websockets/websockets.module';
import { MapsModule } from '../maps/maps.module';

import { SearchModule } from '../search/search.module';
import { DatabaseModule } from '../../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DatabaseModule, ConfigModule, SearchModule, WebsocketsModule, MapsModule],
    controllers: [RestaurantsController],
    providers: [RestaurantsService],
    exports: [RestaurantsService],
})
export class RestaurantsModule { }
