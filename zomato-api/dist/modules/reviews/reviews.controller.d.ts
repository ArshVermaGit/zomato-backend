import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, dto: any): unknown;
    getRestaurantReviews(id: string): unknown;
    markHelpful(id: string): unknown;
    reportReview(id: string): unknown;
    respondToReview(req: any, id: string, response: string): unknown;
}
