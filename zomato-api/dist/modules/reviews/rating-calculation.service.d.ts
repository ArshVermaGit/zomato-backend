import { PrismaService } from '../../database/prisma.service';
export declare class RatingCalculationService {
    private prisma;
    constructor(prisma: PrismaService);
    updateRestaurantRating(restaurantId: string): any;
    updateDeliveryPartnerRating(partnerId: string): any;
}
