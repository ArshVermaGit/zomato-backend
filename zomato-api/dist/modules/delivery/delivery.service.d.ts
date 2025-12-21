import { PrismaService } from '../../database/prisma.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { S3Service } from '../../common/services/s3.service';
import { LocationService } from '../location/location.service';
import { OrderStateService } from '../orders/order-state.service';
import { EarningsService } from './earnings.service';
import { OnboardingStatus } from '@prisma/client';
export declare class DeliveryService {
    private prisma;
    private s3Service;
    private locationService;
    private orderStateService;
    private earningsService;
    constructor(prisma: PrismaService, s3Service: S3Service, locationService: LocationService, orderStateService: OrderStateService, earningsService: EarningsService);
    private docTypeMap;
    onboard(userId: string, dto: OnboardDeliveryPartnerDto): unknown;
    getUploadUrl(userId: string, docType: string): unknown;
    updateDocumentStatus(userId: string, docTypeKey: string, url: string): unknown;
    getStatus(userId: string): unknown;
    updateVehicle(userId: string, dto: UpdateVehicleDto): unknown;
    verifyPartner(partnerId: string, status: OnboardingStatus): unknown;
}
