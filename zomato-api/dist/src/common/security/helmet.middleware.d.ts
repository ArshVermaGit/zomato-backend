import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class HelmetMiddleware implements NestMiddleware {
    private helmet;
    use(req: Request, res: Response, next: NextFunction): void;
}
export declare const helmetConfig: any;
