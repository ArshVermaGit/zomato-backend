import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { RatingCalculationService } from './rating-calculation.service';
import { DatabaseModule } from '../../database/database.module';
import { SearchModule } from '../search/search.module';
import { WebsocketsModule } from '../websockets/websockets.module';

@Module({
  imports: [DatabaseModule, SearchModule, WebsocketsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, RatingCalculationService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
