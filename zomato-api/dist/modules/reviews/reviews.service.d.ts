import { PrismaService } from '../../database/prisma.service';
import { RatingCalculationService } from './rating-calculation.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
export declare class ReviewsService {
    private prisma;
    private ratingService;
    private realtimeGateway;
    constructor(prisma: PrismaService, ratingService: RatingCalculationService, realtimeGateway: RealtimeGateway);
    createReview(userId: string, dto: CreateReviewDto): unknown;
    getRestaurantReviews(restaurantId: string): unknown;
    markHelpful(reviewId: string): unknown;
    reportReview(reviewId: string): unknown;
    respondToReview(userId: string, reviewId: string, response: string): unknown;
}
