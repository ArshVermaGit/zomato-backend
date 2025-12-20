import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';
import { PaymentWebhookService } from './payment-webhook.service';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';

@Module({
  controllers: [PaymentsController, RefundsController],
  providers: [
    PaymentsService,
    RazorpayService,
    PaymentWebhookService,
    RefundsService,
  ],
  exports: [PaymentsService, RefundsService],
})
export class PaymentsModule {}
