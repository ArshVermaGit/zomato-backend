import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class SearchService implements OnModuleInit {
    private configService;
    private client;
    private restaurantIndex;
    private dishIndex;
    constructor(configService: ConfigService);
    onModuleInit(): any;
    searchRestaurants(query: string, filters?: string): unknown;
    searchDishes(query: string, filters?: string): unknown;
    indexRestaurant(restaurant: any): any;
    removeRestaurant(restaurantId: string): any;
    indexDish(dish: any): any;
    removeDish(dishId: string): any;
}
