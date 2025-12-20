import * as Sentry from '@sentry/node';
import { Express } from 'express';
export declare function initSentry(_app: Express): void;
export declare function initSentryErrorHandler(_app: Express): void;
export declare function captureException(error: Error, context?: Record<string, any>): void;
export declare function captureMessage(message: string, level?: Sentry.SeverityLevel): void;
export declare function setUser(user: {
    id: string;
    email?: string;
    username?: string;
}): void;
export { Sentry };
