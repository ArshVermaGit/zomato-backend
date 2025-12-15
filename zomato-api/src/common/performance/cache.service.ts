import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async delPattern(pattern: string): Promise<void> {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }

    // Cache-aside pattern helper
    async getOrSet<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttlSeconds = 3600
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        const data = await fetchFn();
        await this.set(key, data, ttlSeconds);
        return data;
    }
}

// Cache key generators
export const CacheKeys = {
    restaurant: (id: string) => `restaurant:${id}`,
    restaurantMenu: (id: string) => `restaurant:${id}:menu`,
    user: (id: string) => `user:${id}`,
    order: (id: string) => `order:${id}`,
    popularRestaurants: (location: string) => `popular:${location}`,
    searchResults: (query: string) => `search:${query.toLowerCase().replace(/\s+/g, '-')}`,
};

// TTL constants (in seconds)
export const CacheTTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    DAY: 86400, // 24 hours
};
