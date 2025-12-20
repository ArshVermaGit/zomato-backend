"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const database_module_1 = require("./database/database.module");
const common_module_1 = require("./common/common.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const menu_module_1 = require("./modules/menu/menu.module");
const orders_module_1 = require("./modules/orders/orders.module");
const restaurants_module_1 = require("./modules/restaurants/restaurants.module");
const delivery_module_1 = require("./modules/delivery/delivery.module");
const payments_module_1 = require("./modules/payments/payments.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const websockets_module_1 = require("./modules/websockets/websockets.module");
const maps_module_1 = require("./modules/maps/maps.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const promos_module_1 = require("./modules/promos/promos.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const redis_module_1 = require("./modules/redis/redis.module");
const location_module_1 = require("./modules/location/location.module");
const search_module_1 = require("./modules/search/search.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            redis_module_1.RedisModule,
            location_module_1.LocationModule,
            common_module_1.CommonModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            restaurants_module_1.RestaurantsModule,
            menu_module_1.MenuModule,
            orders_module_1.OrdersModule,
            delivery_module_1.DeliveryModule,
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            location_module_1.LocationModule,
            search_module_1.SearchModule,
            websockets_module_1.WebsocketsModule,
            maps_module_1.MapsModule,
            reviews_module_1.ReviewsModule,
            promos_module_1.PromosModule,
            analytics_module_1.AnalyticsModule,
            jobs_module_1.JobsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map