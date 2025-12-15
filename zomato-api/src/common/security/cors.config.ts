import cors, { CorsOptions } from 'cors';

const allowedOrigins = [
    process.env.CUSTOMER_APP_URL || 'http://localhost:8081',
    process.env.ADMIN_URL || 'http://localhost:3001',
    process.env.RESTAURANT_APP_URL || 'http://localhost:8082',
    process.env.DELIVERY_APP_URL || 'http://localhost:8083',
    'http://localhost:3000',
    'http://localhost:3001',
];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
};

export const corsMiddleware = cors(corsOptions);
