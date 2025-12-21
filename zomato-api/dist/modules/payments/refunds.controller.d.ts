import { RefundsService } from './refunds.service';
export declare class RefundsController {
    private refundsService;
    constructor(refundsService: RefundsService);
    calculateRefund(orderId: string): unknown;
    processRefund(orderId: string, type: 'GATEWAY' | 'WALLET', reason: string): unknown;
}
