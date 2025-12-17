"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRateLimiter = exports.otpRateLimiter = exports.authRateLimiter = exports.apiRateLimiter = void 0;
exports.createRedisRateLimiter = createRedisRateLimiter;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || 'unknown',
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.otpRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 3,
    message: { error: 'Too many OTP requests, please wait.' },
});
exports.paymentRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: 'Too many payment attempts, please try again later.' },
});
function createRedisRateLimiter(redisClient, options = {}) {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 100,
        message: options.message || { error: 'Too many requests' },
        store: new rate_limit_redis_1.default({
            sendCommand: (...args) => redisClient.call(...args),
        }),
    });
}
//# sourceMappingURL=rate-limiter.js.map