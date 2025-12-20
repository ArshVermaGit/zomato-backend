import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { PaymentsService } from '../../payments/payments.service';

@Processor('payments')
export class PaymentJobsProcessor {
  private readonly logger = new Logger(PaymentJobsProcessor.name);

  constructor(private paymentsService: PaymentsService) {}

  @Process('processPayouts')
  processPayouts(_job: Job) {
    this.logger.log('Processing Daily Payouts...');
    // Logic to iterate over Delivery Partners and process earnings payout
    // await this.paymentsService.processDailyPayouts();
  }

  @Process('retryFailedRefunds')
  retryFailedRefunds(_job: Job) {
    this.logger.log('Retrying Failed Refunds...');
    // Logic: Find refunds in FAILED state < 3 retries and re-trigger
  }
}
