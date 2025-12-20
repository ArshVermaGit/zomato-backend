import type { Job } from 'bull';
import { PaymentsService } from '../../payments/payments.service';
export declare class PaymentJobsProcessor {
    private paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    processPayouts(_job: Job): void;
    retryFailedRefunds(_job: Job): void;
}
