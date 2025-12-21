import { PrismaService } from '../../database/prisma.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { S3Service } from '../../common/services/s3.service';
import { GeocodingService } from '../../common/services/geocoding.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, UpdateMenuItemDto } from './dto/restaurant.dto';
import { SearchService } from '../search/search.service';
export declare class RestaurantsService {
    private prisma;
    private realtimeGateway;
    private s3Service;
    private geocodingService;
    private searchService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, s3Service: S3Service, geocodingService: GeocodingService, searchService: SearchService);
    createRestaurant(partnerId: string, dto: CreateRestaurantDto): unknown;
    approveRestaurant(restaurantId: string, adminId: string): unknown;
    getNearbyRestaurants(lat: number, lng: number, radius?: number): unknown;
    toggleRestaurantStatus(restaurantId: string, partnerId: string): unknown;
    updateMenuItem(itemId: string, restaurantId: string, dto: UpdateMenuItemDto): unknown;
    findAll(filter: RestaurantFilterDto): unknown;
    findOne(id: string): unknown;
    search(query: string): unknown;
    update(id: string, data: UpdateRestaurantDto): unknown;
    findByPartnerUserId(userId: string): unknown;
    getStats(restaurantId: string): unknown;
    getAnalytics(restaurantId: string, range: string): {
        range: string;
        data: {
            date: string;
            orders: number;
            revenue: number;
        }[];
    };
}
