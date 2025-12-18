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
    onboard(userId: string, dto: OnboardDeliveryPartnerDto): Promise<{
        id: string;
        userId: string;
        vehicleType: import(".prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/library").JsonValue | null;
        documentsVerified: boolean;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        bankDetails: import("@prisma/client/runtime/library").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/library").JsonValue | null;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client/runtime/library").Decimal;
        availableBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    getUploadUrl(userId: string, docType: string): Promise<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
    }>;
    updateDocumentStatus(userId: string, docTypeKey: string, url: string): Promise<{
        type: import(".prisma/client").$Enums.DocumentType;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        deliveryPartnerId: string;
        fileUrl: string;
        rejectionReason: string | null;
        uploadedAt: Date;
        verifiedAt: Date | null;
    }>;
    getStatus(userId: string): Promise<{
        status: string;
        documents?: undefined;
        documentsVerified?: undefined;
    } | {
        status: import(".prisma/client").$Enums.OnboardingStatus;
        documents: {};
        documentsVerified: boolean;
    }>;
    updateVehicle(userId: string, dto: UpdateVehicleDto): Promise<{
        id: string;
        userId: string;
        vehicleType: import(".prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/library").JsonValue | null;
        documentsVerified: boolean;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        bankDetails: import("@prisma/client/runtime/library").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/library").JsonValue | null;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client/runtime/library").Decimal;
        availableBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    verifyPartner(partnerId: string, status: OnboardingStatus): Promise<{
        id: string;
        userId: string;
        vehicleType: import(".prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/library").JsonValue | null;
        documentsVerified: boolean;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        bankDetails: import("@prisma/client/runtime/library").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/library").JsonValue | null;
        rating: import("@prisma/client/runtime/library").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client/runtime/library").Decimal;
        availableBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
}
