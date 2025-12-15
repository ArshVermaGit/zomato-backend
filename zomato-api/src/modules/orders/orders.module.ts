import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, OrderStateService],
    exports: [OrdersService, OrderStateService],
})
export class OrdersModule { }
