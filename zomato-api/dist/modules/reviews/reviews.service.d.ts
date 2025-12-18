import { PrismaService } from '../../database/prisma.service';
import { RatingCalculationService } from './rating-calculation.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
export declare class ReviewsService {
    private prisma;
    private ratingService;
    private realtimeGateway;
    constructor(prisma: PrismaService, ratingService: RatingCalculationService, realtimeGateway: RealtimeGateway);
    createReview(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            name: string;
            avatar: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        deliveryRating: number | null;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
        orderId: string;
    }>;
    getRestaurantReviews(restaurantId: string): Promise<({
        user: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        tags: string[];
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        deliveryRating: number | null;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
        orderId: string;
    })[]>;
    markHelpful(reviewId: string): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        deliveryRating: number | null;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
        orderId: string;
    }>;
    reportReview(reviewId: string): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        deliveryRating: number | null;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
        orderId: string;
    }>;
    respondToReview(userId: string, reviewId: string, response: string): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        deliveryRating: number | null;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
        orderId: string;
    }>;
}
