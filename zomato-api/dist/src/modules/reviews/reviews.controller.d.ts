import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, dto: any): Promise<{
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
    getRestaurantReviews(id: string): Promise<({
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
    markHelpful(id: string): Promise<{
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
    reportReview(id: string): Promise<{
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
    respondToReview(req: any, id: string, response: string): Promise<{
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
