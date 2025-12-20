import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { EarningsService } from './earnings.service';
import { DatabaseModule } from '../../database/database.module';
import { LocationModule } from '../location/location.module';
import { OrdersModule } from '../orders/orders.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, LocationModule, forwardRef(() => OrdersModule)],
  controllers: [DeliveryController],
  providers: [DeliveryService, EarningsService],
  exports: [DeliveryService, EarningsService],
})
export class DeliveryModule {}
