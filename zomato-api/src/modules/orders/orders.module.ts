import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';
import { WebsocketsModule } from '../websockets/websockets.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { PromosModule } from '../promos/promos.module';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [
    WebsocketsModule,
    NotificationsModule,
    PaymentsModule,
    PromosModule,
    forwardRef(() => DeliveryModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderStateService],
  exports: [OrdersService, OrderStateService],
})
export class OrdersModule {}
