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
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
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
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
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
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
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
        response: string | null;
        respondedAt: Date | null;
        helpfulCount: number;
        isReported: boolean;
        orderId: string;
    }>;
}
