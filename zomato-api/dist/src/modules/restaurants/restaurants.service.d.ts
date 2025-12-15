import { PrismaService } from '../../database/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, NearbyRestaurantDto } from './dto/restaurant.dto';
import { Prisma } from '@prisma/client';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: Prisma.JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
    }>;
    findAll(filter: RestaurantFilterDto): Promise<{
        items: ({
            menuCategories: {
                name: string;
                description: string | null;
                id: string;
                restaurantId: string;
                displayOrder: number;
            }[];
        } & {
            name: string;
            description: string | null;
            email: string;
            location: Prisma.JsonValue;
            id: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            rating: Prisma.Decimal;
            deliveryFee: Prisma.Decimal;
            images: string[];
            cuisineTypes: string[];
            isOpen: boolean;
            totalRatings: number;
            preparationTime: number;
            minimumOrder: Prisma.Decimal;
            partnerId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        reviews: {
            tags: string[];
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            restaurantId: string;
            deliveryRating: number | null;
            comment: string | null;
            images: string[];
            helpfulCount: number;
            isReported: boolean;
            response: string | null;
            respondedAt: Date | null;
            orderId: string;
        }[];
        menuCategories: ({
            items: {
                name: string;
                description: string;
                id: string;
                isAvailable: boolean;
                images: string[];
                price: Prisma.Decimal;
                isVeg: boolean;
                categoryId: string;
            }[];
        } & {
            name: string;
            description: string | null;
            id: string;
            restaurantId: string;
            displayOrder: number;
        })[];
    } & {
        name: string;
        description: string | null;
        email: string;
        location: Prisma.JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
    }>;
    search(query: string): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: Prisma.JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
    }[]>;
    findNearby(dto: NearbyRestaurantDto): Promise<unknown>;
    update(id: string, data: UpdateRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: Prisma.JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
    }>;
    findByPartnerUserId(userId: string): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: Prisma.JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
    }[]>;
}
