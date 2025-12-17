import { PrismaService } from '../../database/prisma.service';
import { RatingCalculationService } from './rating-calculation.service';
export declare class ReviewsService {
    private prisma;
    private ratingService;
    constructor(prisma: PrismaService, ratingService: RatingCalculationService);
    createReview(userId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        orderId: string;
    }>;
    getRestaurantReviews(restaurantId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        orderId: string;
    }[]>;
    markHelpful(reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        orderId: string;
    }>;
    reportReview(reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        orderId: string;
    }>;
    respondToReview(userId: string, reviewId: string, response: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        restaurantId: string;
        comment: string | null;
        images: string[];
        response: string | null;
        respondedAt: Date | null;
        orderId: string;
    }>;
}
