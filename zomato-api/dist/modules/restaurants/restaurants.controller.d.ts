import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, SearchRestaurantDto, NearbyRestaurantDto } from './dto/restaurant.dto';
export declare class RestaurantsController {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(dto: CreateRestaurantDto, req: any): Promise<{
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
        location: import("@prisma/client/runtime/library").JsonValue;
        preparationTime: number;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalRatings: number;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    approve(id: string, req: any): Promise<{
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
        location: import("@prisma/client/runtime/library").JsonValue;
        preparationTime: number;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalRatings: number;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyRestaurants(req: any): Promise<{
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        preparationTime: number;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalRatings: number;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        preparationTime: number;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalRatings: number;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    search(dto: SearchRestaurantDto): Promise<{
        description: string | null;
        name: string;
        cuisineTypes: string[];
        phone: string;
        email: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        preparationTime: number;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalRatings: number;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findNearby(dto: NearbyRestaurantDto): Promise<unknown>;
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
            location: import("@prisma/client/runtime/library").JsonValue;
            preparationTime: number;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            minimumOrder: import("@prisma/client/runtime/library").Decimal;
            partnerId: string;
            isOpen: boolean;
            isActive: boolean;
            id: string;
            rating: import("@prisma/client/runtime/library").Decimal;
            totalRatings: number;
            deliveryRadius: import("@prisma/client/runtime/library").Decimal;
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
                price: import("@prisma/client/runtime/library").Decimal;
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
        location: import("@prisma/client/runtime/library").JsonValue;
        preparationTime: number;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        minimumOrder: import("@prisma/client/runtime/library").Decimal;
        partnerId: string;
        isOpen: boolean;
        isActive: boolean;
        id: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalRatings: number;
        deliveryRadius: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        coverImage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMenu(id: string): Promise<({
        items: {
            description: string;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
    })[]>;
}
