import {
  register,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Collect default system metrics
collectDefaultMetrics({ prefix: 'zomato_' });

// HTTP request duration
export const httpRequestDuration = new Histogram({
  name: 'zomato_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

// HTTP request count
export const httpRequestTotal = new Counter({
  name: 'zomato_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Business metrics
export const ordersCreated = new Counter({
  name: 'zomato_orders_created_total',
  help: 'Total number of orders created',
  labelNames: ['restaurant_id'],
});

export const ordersCompleted = new Counter({
  name: 'zomato_orders_completed_total',
  help: 'Total number of orders completed',
});

export const activeDeliveryPartners = new Gauge({
  name: 'zomato_active_delivery_partners',
  help: 'Number of currently active delivery partners',
});

export const activeOrders = new Gauge({
  name: 'zomato_active_orders',
  help: 'Number of currently active orders',
});

// Database metrics
export const dbQueryDuration = new Histogram({
  name: 'zomato_db_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1],
});

// Middleware to track HTTP metrics
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path || 'unknown';
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });

  next();
}

// Metrics endpoint handler
export async function metricsHandler(req: Request, res: Response) {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
}

export { register };
