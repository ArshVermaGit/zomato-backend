export declare class CreateRestaurantDto {
    name: string;
    description?: string;
    cuisineTypes: string[];
    phone: string;
    email: string;
    location: any;
    preparationTime: number;
    deliveryFee: number;
    minimumOrder?: number;
    partnerId: string;
}
export declare class UpdateRestaurantDto {
    name?: string;
    description?: string;
    cuisineTypes?: string[];
    isOpen?: boolean;
    isActive?: boolean;
}
export declare class RestaurantFilterDto {
    cuisine?: string;
    vegOnly?: boolean;
    minRating?: number;
    maxDeliveryFee?: number;
    page?: number;
    limit?: number;
}
export declare class SearchRestaurantDto {
    query: string;
}
export declare class NearbyRestaurantDto {
    lat: number;
    lng: number;
    radius?: number;
}
export declare class UpdateMenuItemDto {
    name?: string;
    description?: string;
    price?: number;
    isAvailable?: boolean;
    isVeg?: boolean;
    isBestseller?: boolean;
}
