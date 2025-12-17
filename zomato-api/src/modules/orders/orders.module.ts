import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';
import { WebsocketsModule } from '../websockets/websockets.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [
        WebsocketsModule,
        NotificationsModule,
        PaymentsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrderStateService],
    exports: [OrdersService, OrderStateService],
})
export class OrdersModule { }
