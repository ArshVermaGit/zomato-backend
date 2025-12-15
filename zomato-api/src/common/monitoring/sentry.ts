import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

export function initSentry(app: Express) {
    if (!process.env.SENTRY_DSN) {
        console.warn('SENTRY_DSN not set, Sentry will not be initialized');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        profilesSampleRate: 0.1,
        integrations: [
            nodeProfilingIntegration(),
        ],
    });

    // Request handler (must be first middleware)
    app.use(Sentry.Handlers.requestHandler());

    // Tracing handler
    app.use(Sentry.Handlers.tracingHandler());
}

export function initSentryErrorHandler(app: Express) {
    // Error handler (must be before other error handlers)
    app.use(Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
            // Capture all 500 errors
            if (error.status >= 500) {
                return true;
            }
            return false;
        },
    }));
}

export function captureException(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string; username?: string }) {
    Sentry.setUser(user);
}

export { Sentry };
