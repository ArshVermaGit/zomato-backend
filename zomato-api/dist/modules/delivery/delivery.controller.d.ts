import { DeliveryService } from './delivery.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { EarningsService } from './earnings.service';
import { OnboardingStatus } from '@prisma/client';
export declare class DeliveryController {
    private deliveryService;
    private earningsService;
    constructor(deliveryService: DeliveryService, earningsService: EarningsService);
    requestPayout(req: any, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        deliveryPartnerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        processedAt: Date | null;
        referenceId: string | null;
    }>;
    getTransactions(req: any): Promise<{
        type: import(".prisma/client").$Enums.WalletTransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        deliveryPartnerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getPayoutHistory(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PayoutStatus;
        deliveryPartnerId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        processedAt: Date | null;
        referenceId: string | null;
    }[]>;
    getPerformanceMetrics(req: any): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: import("@prisma/client/runtime/library").Decimal;
    }>;
    onboard(req: any, dto: OnboardDeliveryPartnerDto): Promise<{
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
    getUploadUrl(req: any, docType: string): Promise<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
    }>;
    confirmUpload(req: any, body: {
        docType: string;
        url: string;
    }): Promise<{
        type: import(".prisma/client").$Enums.DocumentType;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        deliveryPartnerId: string;
        fileUrl: string;
        rejectionReason: string | null;
        uploadedAt: Date;
        verifiedAt: Date | null;
    }>;
    getStatus(req: any): Promise<{
        status: string;
        documents?: undefined;
        documentsVerified?: undefined;
    } | {
        status: import(".prisma/client").$Enums.OnboardingStatus;
        documents: {};
        documentsVerified: boolean;
    }>;
    updateVehicle(req: any, dto: UpdateVehicleDto): Promise<{
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
