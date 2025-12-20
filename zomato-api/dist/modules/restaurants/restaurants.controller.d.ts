import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, NearbyRestaurantDto } from './dto/restaurant.dto';
export declare class RestaurantsController {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(dto: CreateRestaurantDto, req: any): Promise<{
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
        location: import("@prisma/client/runtime/library").JsonValue;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        description: string | null;
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
        location: import("@prisma/client/runtime/library").JsonValue;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        description: string | null;
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
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: import("@prisma/client/runtime/library").JsonValue;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        description: string | null;
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
    getAnalytics(req: any, restaurantId: string, range: string): {
        range: string;
        data: {
            date: string;
            orders: number;
            revenue: number;
        }[];
    };
    update(id: string, dto: UpdateRestaurantDto): Promise<{
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: import("@prisma/client/runtime/library").JsonValue;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        description: string | null;
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
        id: string;
        phone: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: import("@prisma/client/runtime/library").JsonValue;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        description: string | null;
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
            location: import("@prisma/client/runtime/library").JsonValue;
            rating: import("@prisma/client/runtime/library").Decimal;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            description: string | null;
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
                price: import("@prisma/client/runtime/library").Decimal;
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
        location: import("@prisma/client/runtime/library").JsonValue;
        rating: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        description: string | null;
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
            id: string;
            name: string;
            isAvailable: boolean;
            images: string[];
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
    })[]>;
}
