interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    services: {
        database: 'up' | 'down';
        redis: 'up' | 'down';
    };
}
export declare class HealthController {
    check(): Promise<HealthCheckResponse>;
    live(): {
        status: string;
    };
    ready(): {
        status: string;
    };
}
export {};
