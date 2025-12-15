import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantFilterDto, SearchRestaurantDto, NearbyRestaurantDto } from './dto/restaurant.dto';
export declare class RestaurantsController {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(dto: CreateRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client-runtime-utils").Decimal;
        partnerId: string;
    }>;
    getMyRestaurants(req: any): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client-runtime-utils").Decimal;
        partnerId: string;
    }[]>;
    update(id: string, dto: UpdateRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client-runtime-utils").Decimal;
        partnerId: string;
    }>;
    search(dto: SearchRestaurantDto): Promise<{
        name: string;
        description: string | null;
        email: string;
        location: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client-runtime-utils").Decimal;
        partnerId: string;
    }[]>;
    findNearby(dto: NearbyRestaurantDto): Promise<unknown>;
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
            location: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            rating: import("@prisma/client-runtime-utils").Decimal;
            deliveryFee: import("@prisma/client-runtime-utils").Decimal;
            images: string[];
            cuisineTypes: string[];
            isOpen: boolean;
            totalRatings: number;
            preparationTime: number;
            minimumOrder: import("@prisma/client-runtime-utils").Decimal;
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
                price: import("@prisma/client-runtime-utils").Decimal;
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
        location: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal;
        deliveryFee: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        cuisineTypes: string[];
        isOpen: boolean;
        totalRatings: number;
        preparationTime: number;
        minimumOrder: import("@prisma/client-runtime-utils").Decimal;
        partnerId: string;
    }>;
    getMenu(id: string): Promise<({
        items: {
            name: string;
            description: string;
            id: string;
            isAvailable: boolean;
            images: string[];
            price: import("@prisma/client-runtime-utils").Decimal;
            isVeg: boolean;
            categoryId: string;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        restaurantId: string;
        displayOrder: number;
    })[]>;
}
