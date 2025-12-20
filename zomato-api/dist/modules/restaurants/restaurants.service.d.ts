import { PrismaService } from '../../database/prisma.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { S3Service } from '../../common/services/s3.service';
import { GeocodingService } from '../../common/services/geocoding.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, UpdateMenuItemDto } from './dto/restaurant.dto';
import { Prisma } from '@prisma/client';
import { SearchService } from '../search/search.service';
export declare class RestaurantsService {
    private prisma;
    private realtimeGateway;
    private s3Service;
    private geocodingService;
    private searchService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, s3Service: S3Service, geocodingService: GeocodingService, searchService: SearchService);
    createRestaurant(partnerId: string, dto: CreateRestaurantDto): Promise<{
        partner: {
            user: {
                id: string;
                phone: string;
                email: string | null;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                isActive: boolean;
                isVerified: boolean;
                passwordHash: string | null;
                createdAt: Date;
                updatedAt: Date;
                fcmTokens: string[];
            };
        } & {
            id: string;
            userId: string;
        };
    } & {
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    approveRestaurant(restaurantId: string, adminId: string): Promise<{
        partner: {
            user: {
                id: string;
                phone: string;
                email: string | null;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                isActive: boolean;
                isVerified: boolean;
                passwordHash: string | null;
                createdAt: Date;
                updatedAt: Date;
                fcmTokens: string[];
            };
        } & {
            id: string;
            userId: string;
        };
    } & {
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    getNearbyRestaurants(lat: number, lng: number, radius?: number): Promise<unknown>;
    toggleRestaurantStatus(restaurantId: string, partnerId: string): Promise<{
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    updateMenuItem(itemId: string, restaurantId: string, dto: UpdateMenuItemDto): Promise<{
        id: string;
        name: string;
        isAvailable: boolean;
        images: string[];
        description: string;
        price: Prisma.Decimal;
        isVeg: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    findAll(filter: RestaurantFilterDto): Promise<{
        items: ({
            menuCategories: {
                id: string;
                name: string;
                isActive: boolean;
                restaurantId: string;
                description: string | null;
                displayOrder: number;
            }[];
        } & {
            id: string;
            phone: string;
            email: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            location: Prisma.JsonValue;
            rating: Prisma.Decimal;
            deliveryFee: Prisma.Decimal;
            images: string[];
            description: string | null;
            cuisineTypes: string[];
            isOpen: boolean;
            totalRatings: number;
            preparationTime: number;
            minimumOrder: Prisma.Decimal;
            deliveryRadius: Prisma.Decimal;
            coverImage: string | null;
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
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            restaurantId: string;
            deliveryRating: number | null;
            comment: string | null;
            images: string[];
            tags: string[];
            response: string | null;
            respondedAt: Date | null;
            helpfulCount: number;
            isReported: boolean;
            orderId: string;
        }[];
        menuCategories: ({
            items: {
                id: string;
                name: string;
                isAvailable: boolean;
                images: string[];
                description: string;
                price: Prisma.Decimal;
                isVeg: boolean;
                isBestseller: boolean;
                categoryId: string;
            }[];
        } & {
            id: string;
            name: string;
            isActive: boolean;
            restaurantId: string;
            description: string | null;
            displayOrder: number;
        })[];
    } & {
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    search(query: string): Promise<{
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }[]>;
    update(id: string, data: UpdateRestaurantDto): Promise<{
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    findByPartnerUserId(userId: string): Promise<{
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: Prisma.JsonValue;
        rating: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        images: string[];
        description: string | null;
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: Prisma.Decimal;
        deliveryRadius: Prisma.Decimal;
        coverImage: string | null;
        partnerId: string;
    }[]>;
    getStats(restaurantId: string): Promise<{
        totalOrders: number;
        totalRevenue: number | Prisma.Decimal;
        averageRating: number;
    }>;
    getAnalytics(restaurantId: string, range: string): {
        range: string;
        data: {
            date: string;
            orders: number;
            revenue: number;
        }[];
    };
}
