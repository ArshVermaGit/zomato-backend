import { Job } from 'bull';
import { PaymentsService } from '../../payments/payments.service';
export declare class PaymentJobsProcessor {
    private paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    processPayouts(job: Job): Promise<void>;
    retryFailedRefunds(job: Job): Promise<void>;
}
