"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (stack) {
        log += `\n${stack}`;
    }
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
    }
    return log;
});
const logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), winston_1.format.json()),
    defaultMeta: { service: 'zomato-api' },
    transports: [
        new winston_1.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston_1.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat),
    }));
}
exports.httpLogger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({
            filename: 'logs/http.log',
            maxsize: 5242880,
            maxFiles: 3,
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map