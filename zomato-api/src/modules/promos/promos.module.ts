import { Module } from '@nestjs/common';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';
import { PromoValidationService } from './promo-validation.service';

@Module({
  controllers: [PromosController],
  providers: [PromosService, PromoValidationService],
  exports: [PromosService],
})
export class PromosModule {}
