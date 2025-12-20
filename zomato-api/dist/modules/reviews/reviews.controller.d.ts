import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, dto: CreateReviewDto): Promise<{
        user: {
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        rating: number;
        images: string[];
        createdAt: Date;
        userId: string;
        restaurantId: string;
        orderId: string;
        deliveryRating: number | null;
        comment: string | null;
        tags: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
    }>;
    getRestaurantReviews(id: string): Promise<({
        user: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        rating: number;
        images: string[];
        createdAt: Date;
        userId: string;
        restaurantId: string;
        orderId: string;
        deliveryRating: number | null;
        comment: string | null;
        tags: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
    })[]>;
    markHelpful(id: string): Promise<{
        id: string;
        rating: number;
        images: string[];
        createdAt: Date;
        userId: string;
        restaurantId: string;
        orderId: string;
        deliveryRating: number | null;
        comment: string | null;
        tags: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
    }>;
    reportReview(id: string): Promise<{
        id: string;
        rating: number;
        images: string[];
        createdAt: Date;
        userId: string;
        restaurantId: string;
        orderId: string;
        deliveryRating: number | null;
        comment: string | null;
        tags: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
    }>;
    respondToReview(req: any, id: string, response: string): Promise<{
        id: string;
        rating: number;
        images: string[];
        createdAt: Date;
        userId: string;
        restaurantId: string;
        orderId: string;
        deliveryRating: number | null;
        comment: string | null;
        tags: string[];
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
    }>;
}
