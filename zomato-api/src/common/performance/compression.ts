import compression from 'compression';
import { Request, Response } from 'express';

// Compression middleware configuration
export const compressionMiddleware = compression({
    level: 6, // Compression level (1-9)
    threshold: 1024, // Minimum size to compress (1KB)
    filter: (req: Request, res: Response) => {
        // Don't compress if client doesn't accept
        if (req.headers['x-no-compression']) {
            return false;
        }
        // Use compression's default filter
        return compression.filter(req, res);
    },
});

// Alternative: Create configurable compression
export function createCompression(options: compression.CompressionOptions = {}) {
    return compression({
        level: 6,
        threshold: 1024,
        ...options,
    });
}
