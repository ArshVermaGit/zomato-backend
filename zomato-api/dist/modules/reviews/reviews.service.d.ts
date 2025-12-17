import { PrismaService } from '../../database/prisma.service';
import { RatingCalculationService } from './rating-calculation.service';
export declare class ReviewsService {
    private prisma;
    private ratingService;
    constructor(prisma: PrismaService, ratingService: RatingCalculationService);
    createReview(userId: string, dto: any): unknown;
    getRestaurantReviews(restaurantId: string): unknown;
    markHelpful(reviewId: string): unknown;
    reportReview(reviewId: string): unknown;
    respondToReview(userId: string, reviewId: string, response: string): unknown;
}
