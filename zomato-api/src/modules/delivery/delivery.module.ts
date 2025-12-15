import { Module, forwardRef } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { LocationService } from './location.service';
import { OrdersModule } from '../orders/orders.module';

import { EarningsService } from './earnings.service';

@Module({
    imports: [forwardRef(() => OrdersModule)],
    controllers: [DeliveryController],
    providers: [DeliveryService, LocationService, EarningsService],
    exports: [DeliveryService, LocationService, EarningsService],
})
export class DeliveryModule { }
