import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, SearchRestaurantDto, NearbyRestaurantDto } from './dto/restaurant.dto';
export declare class RestaurantsController {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(dto: CreateRestaurantDto, req: any): Promise<{
        partner: {
            user: {
                name: string;
                email: string | null;
                id: string;
                phone: string;
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
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    approve(id: string, req: any): Promise<{
        partner: {
            user: {
                name: string;
                email: string | null;
                id: string;
                phone: string;
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
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    getMyRestaurants(req: any): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        coverImage: string | null;
        partnerId: string;
    }[]>;
    getStats(req: any, restaurantId: string): Promise<{
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        averageRating: number;
    }>;
    getAnalytics(req: any, restaurantId: string, range: string): Promise<{
        range: string;
        data: {
            date: string;
            orders: number;
            revenue: number;
        }[];
    }>;
    update(id: string, dto: UpdateRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    search(dto: SearchRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        coverImage: string | null;
        partnerId: string;
    }[]>;
    findNearby(dto: NearbyRestaurantDto): Promise<unknown>;
    findAll(filter: RestaurantFilterDto): Promise<{
        items: ({
            menuCategories: {
                name: string;
                description: string | null;
                id: string;
                isActive: boolean;
                restaurantId: string;
                displayOrder: number;
            }[];
        } & {
            name: string;
            description: string | null;
            email: string;
            location: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            rating: import("@prisma/client/runtime/library").Decimal;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            cuisineTypes: string[];
            isOpen: boolean;
            totalRatings: number;
            preparationTime: number;
            minimumOrder: import("@prisma/client/runtime/library").Decimal;
            deliveryRadius: import("@prisma/client/runtime/library").Decimal;
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
            tags: string[];
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            restaurantId: string;
            deliveryRating: number | null;
            comment: string | null;
            images: string[];
            response: string | null;
            respondedAt: Date | null;
            helpfulCount: number;
            isReported: boolean;
            orderId: string;
        }[];
        menuCategories: ({
            items: {
                name: string;
                description: string;
                id: string;
                isAvailable: boolean;
                images: string[];
                price: import("@prisma/client/runtime/library").Decimal;
                isVeg: boolean;
                categoryId: string;
                isBestseller: boolean;
            }[];
        } & {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            restaurantId: string;
            displayOrder: number;
        })[];
    } & {
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        coverImage: string | null;
        partnerId: string;
    }>;
    getMenu(id: string): Promise<({
        items: {
            name: string;
            description: string;
            id: string;
            isAvailable: boolean;
            images: string[];
            price: import("@prisma/client/runtime/library").Decimal;
            isVeg: boolean;
            categoryId: string;
            isBestseller: boolean;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    })[]>;
}
