import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
// Modules might not exist yet or are empty, checking if I should comment them out or if they exist
// I validated "modules" dir exists and has subdirs. Use relative paths.
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { MapsModule } from './modules/maps/maps.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PromosModule } from './modules/promos/promos.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { RedisModule } from './modules/redis/redis.module';

import { LocationModule } from './modules/location/location.module';
import { SearchModule } from './modules/search/search.module';
// import { RealtimeModule } from './modules/realtime/realtime.module'; // Removed non-existent module

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    RedisModule,
    LocationModule,
    CommonModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    MenuModule,
    OrdersModule,
    DeliveryModule,
    PaymentsModule,
    NotificationsModule,
    LocationModule,
    SearchModule,
    WebsocketsModule,
    MapsModule,
    ReviewsModule,
    PromosModule,
    AnalyticsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
