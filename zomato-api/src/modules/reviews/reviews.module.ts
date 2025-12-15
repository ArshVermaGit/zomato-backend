import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { RatingCalculationService } from './rating-calculation.service';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService, RatingCalculationService],
    exports: [ReviewsService]
})
export class ReviewsModule { }
