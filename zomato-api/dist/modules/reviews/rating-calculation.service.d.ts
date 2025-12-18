import { PrismaService } from '../../database/prisma.service';
import { SearchService } from '../search/search.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
export declare class RatingCalculationService {
    private prisma;
    private searchService;
    private realtimeGateway;
    constructor(prisma: PrismaService, searchService: SearchService, realtimeGateway: RealtimeGateway);
    updateRestaurantRating(restaurantId: string): Promise<void>;
    updateDeliveryPartnerRating(partnerId: string): Promise<void>;
}
