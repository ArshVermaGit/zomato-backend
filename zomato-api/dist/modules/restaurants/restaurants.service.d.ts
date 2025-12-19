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
                name: string;
                phone: string;
                email: string | null;
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                isVerified: boolean;
                passwordHash: string | null;
                fcmTokens: string[];
            };
        } & {
            id: string;
            userId: string;
        };
    } & {
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    approveRestaurant(restaurantId: string, adminId: string): Promise<{
        partner: {
            user: {
                name: string;
                phone: string;
                email: string | null;
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
                isVerified: boolean;
                passwordHash: string | null;
                fcmTokens: string[];
            };
        } & {
            id: string;
            userId: string;
        };
    } & {
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getNearbyRestaurants(lat: number, lng: number, radius?: number): Promise<unknown>;
    toggleRestaurantStatus(restaurantId: string, partnerId: string): Promise<{
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMenuItem(itemId: string, restaurantId: string, dto: UpdateMenuItemDto): Promise<{
        description: string;
        name: string;
        price: Prisma.Decimal;
        isAvailable: boolean;
        isVeg: boolean;
        isBestseller: boolean;
        id: string;
        images: string[];
        categoryId: string;
    }>;
    findAll(filter: RestaurantFilterDto): Promise<{
        items: ({
            menuCategories: {
                description: string | null;
                name: string;
                isActive: boolean;
                id: string;
                restaurantId: string;
                displayOrder: number;
            }[];
        } & {
            description: string | null;
            name: string;
            cuisineTypes: string[];
            phone: string;
            email: string;
            location: Prisma.JsonValue;
            preparationTime: number;
            deliveryFee: Prisma.Decimal;
            minimumOrder: Prisma.Decimal;
            partnerId: string;
            isOpen: boolean;
            isActive: boolean;
            id: string;
            rating: Prisma.Decimal;
            totalRatings: number;
            deliveryRadius: Prisma.Decimal;
            images: string[];
            coverImage: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        menuCategories: ({
            items: {
                description: string;
                name: string;
                price: Prisma.Decimal;
                isAvailable: boolean;
                isVeg: boolean;
                isBestseller: boolean;
                id: string;
                images: string[];
                categoryId: string;
            }[];
        } & {
            description: string | null;
            name: string;
            isActive: boolean;
            id: string;
            restaurantId: string;
            displayOrder: number;
        })[];
        reviews: {
            id: string;
            rating: number;
            images: string[];
            createdAt: Date;
            userId: string;
            restaurantId: string;
            tags: string[];
            orderId: string;
            deliveryRating: number | null;
            comment: string | null;
            response: string | null;
            respondedAt: Date | null;
            helpfulCount: number;
            isReported: boolean;
        }[];
    } & {
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    search(query: string): Promise<{
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, data: UpdateRestaurantDto): Promise<{
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByPartnerUserId(userId: string): Promise<{
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: Prisma.JsonValue;
        preparationTime: number;
        deliveryFee: Prisma.Decimal;
        minimumOrder: Prisma.Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: Prisma.Decimal;
        totalRatings: number;
        deliveryRadius: Prisma.Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getStats(restaurantId: string): Promise<{
        totalOrders: number;
        totalRevenue: number | Prisma.Decimal;
        averageRating: number;
    }>;
    getAnalytics(restaurantId: string, range: string): Promise<{
        range: string;
        data: {
            date: string;
            orders: number;
            revenue: number;
        }[];
    }>;
}
