import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, NearbyRestaurantDto, SearchRestaurantDto } from './dto/restaurant.dto';
export declare class RestaurantsController {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(dto: CreateRestaurantDto, req: any): unknown;
    approve(id: string, req: any): unknown;
    getMyRestaurants(req: any): unknown;
    getStats(req: any, restaurantId: string): unknown;
    getAnalytics(req: any, restaurantId: string, range: string): {
        range: string;
        data: {
            date: string;
            orders: number;
            revenue: number;
        }[];
    };
    update(id: string, dto: UpdateRestaurantDto): unknown;
    search(dto: SearchRestaurantDto): unknown;
    findNearby(dto: NearbyRestaurantDto): unknown;
    findAll(filter: RestaurantFilterDto): unknown;
    findOne(id: string): unknown;
    getMenu(id: string): unknown;
}
