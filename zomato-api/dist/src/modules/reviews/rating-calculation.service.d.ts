import { PrismaService } from '../../database/prisma.service';
export declare class RatingCalculationService {
    private prisma;
    constructor(prisma: PrismaService);
    updateRestaurantRating(restaurantId: string): Promise<void>;
    updateDeliveryPartnerRating(partnerId: string): Promise<void>;
}
