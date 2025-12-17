"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.dbQueryDuration = exports.activeOrders = exports.activeDeliveryPartners = exports.ordersCompleted = exports.ordersCreated = exports.httpRequestTotal = exports.httpRequestDuration = void 0;
exports.metricsMiddleware = metricsMiddleware;
exports.metricsHandler = metricsHandler;
const prom_client_1 = require("prom-client");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return prom_client_1.register; } });
(0, prom_client_1.collectDefaultMetrics)({ prefix: 'zomato_' });
exports.httpRequestDuration = new prom_client_1.Histogram({
    name: 'zomato_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});
exports.httpRequestTotal = new prom_client_1.Counter({
    name: 'zomato_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});
exports.ordersCreated = new prom_client_1.Counter({
    name: 'zomato_orders_created_total',
    help: 'Total number of orders created',
    labelNames: ['restaurant_id'],
});
exports.ordersCompleted = new prom_client_1.Counter({
    name: 'zomato_orders_completed_total',
    help: 'Total number of orders completed',
});
exports.activeDeliveryPartners = new prom_client_1.Gauge({
    name: 'zomato_active_delivery_partners',
    help: 'Number of currently active delivery partners',
});
exports.activeOrders = new prom_client_1.Gauge({
    name: 'zomato_active_orders',
    help: 'Number of currently active orders',
});
exports.dbQueryDuration = new prom_client_1.Histogram({
    name: 'zomato_db_query_duration_seconds',
    help: 'Duration of database queries',
    labelNames: ['operation', 'table'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1],
});
function metricsMiddleware(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route?.path || req.path || 'unknown';
        const labels = {
            method: req.method,
            route,
            status_code: res.statusCode.toString(),
        };
        exports.httpRequestDuration.observe(labels, duration);
        exports.httpRequestTotal.inc(labels);
    });
    next();
}
async function metricsHandler(req, res) {
    try {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    }
    catch (error) {
        res.status(500).end(error);
    }
}
//# sourceMappingURL=metrics.js.map