import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class SearchService implements OnModuleInit {
    private configService;
    private client;
    private restaurantIndex;
    private dishIndex;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    searchRestaurants(query: string, filters?: string): Promise<import("@algolia/client-search").SearchResponse<unknown> | {
        hits: never[];
    }>;
    searchDishes(query: string, filters?: string): Promise<import("@algolia/client-search").SearchResponse<unknown> | {
        hits: never[];
    }>;
    indexRestaurant(restaurant: any): Promise<void>;
    removeRestaurant(restaurantId: string): Promise<void>;
    indexDish(dish: any): Promise<void>;
    removeDish(dishId: string): Promise<void>;
}
