export declare class CacheService {
    private redis;
    constructor();
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}
export declare const CacheKeys: {
    restaurant: (id: string) => string;
    restaurantMenu: (id: string) => string;
    user: (id: string) => string;
    order: (id: string) => string;
    popularRestaurants: (location: string) => string;
    searchResults: (query: string) => string;
};
export declare const CacheTTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    DAY: number;
};
