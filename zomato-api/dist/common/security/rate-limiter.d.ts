export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const otpRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const paymentRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare function createRedisRateLimiter(redisClient: any, options?: any): import("express-rate-limit").RateLimitRequestHandler;
