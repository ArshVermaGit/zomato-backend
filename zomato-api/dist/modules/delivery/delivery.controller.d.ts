import { DeliveryService } from './delivery.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { EarningsService } from './earnings.service';
import { OnboardingStatus } from '@prisma/client';
export declare class DeliveryController {
    private deliveryService;
    private earningsService;
    constructor(deliveryService: DeliveryService, earningsService: EarningsService);
    requestPayout(req: any, amount: number): unknown;
    getTransactions(req: any): unknown;
    getPayoutHistory(req: any): unknown;
    getPerformanceMetrics(req: any): unknown;
    onboard(req: any, dto: OnboardDeliveryPartnerDto): unknown;
    getUploadUrl(req: any, docType: string): unknown;
    confirmUpload(req: any, body: {
        docType: string;
        url: string;
    }): unknown;
    getStatus(req: any): unknown;
    updateVehicle(req: any, dto: UpdateVehicleDto): unknown;
    verifyPartner(partnerId: string, status: OnboardingStatus): unknown;
}
