import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, dto: any): Promise<{
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
    getRestaurantReviews(id: string): Promise<{
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
    markHelpful(id: string): Promise<{
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
    reportReview(id: string): Promise<{
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
    respondToReview(req: any, id: string, response: string): Promise<{
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
