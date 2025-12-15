import { OrderStatus } from '@prisma/client';
export declare class OrderFilterDto {
    status?: OrderStatus;
    page?: number;
    limit?: number;
}
export declare class CreateRatingDto {
    rating: number;
    comment?: string;
}
