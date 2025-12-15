import { PrismaService } from '../../database/prisma.service';
import { RatingCalculationService } from './rating-calculation.service';
export declare class ReviewsService {
    private prisma;
    private ratingService;
    constructor(prisma: PrismaService, ratingService: RatingCalculationService);
    createReview(userId: string, dto: any): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        deliveryRating: number | null;
        comment: string | null;
        images: string[];
        helpfulCount: number;
        isReported: boolean;
        response: string | null;
        respondedAt: Date | null;
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
        helpfulCount: number;
        isReported: boolean;
        response: string | null;
        respondedAt: Date | null;
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
        helpfulCount: number;
        isReported: boolean;
        response: string | null;
        respondedAt: Date | null;
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
        helpfulCount: number;
        isReported: boolean;
        response: string | null;
        respondedAt: Date | null;
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
        helpfulCount: number;
        isReported: boolean;
        response: string | null;
        respondedAt: Date | null;
        orderId: string;
    }>;
}
