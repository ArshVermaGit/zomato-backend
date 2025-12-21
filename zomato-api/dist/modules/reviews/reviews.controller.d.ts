import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, dto: CreateReviewDto): unknown;
    getRestaurantReviews(id: string): unknown;
    markHelpful(id: string): unknown;
    reportReview(id: string): unknown;
    respondToReview(req: any, id: string, response: string): unknown;
}
