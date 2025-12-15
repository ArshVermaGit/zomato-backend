import { DeliveryService } from './delivery.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { EarningsService } from './earnings.service';
import { OnboardingStatus } from '@prisma/client';
export declare class DeliveryController {
    private deliveryService;
    private earningsService;
    constructor(deliveryService: DeliveryService, earningsService: EarningsService);
    getEarnings(req: any): Promise<{
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
    }>;
    getTransactions(req: any): Promise<{
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        partnerId: string;
        category: import("@prisma/client").$Enums.TransactionCategory;
        amount: import("@prisma/client-runtime-utils").Decimal;
        referenceId: string | null;
    }[]>;
    requestPayout(req: any, amount: number): Promise<{
        method: string | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        partnerId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        processedAt: Date | null;
    }>;
    getPayoutHistory(req: any): Promise<{
        method: string | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PayoutStatus;
        partnerId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string | null;
        processedAt: Date | null;
    }[]>;
    getPerformance(req: any): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: import("@prisma/client-runtime-utils").Decimal;
    }>;
    onboard(req: any, dto: OnboardDeliveryPartnerDto): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        bankDetails: import("@prisma/client/runtime/client").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        onboardingStatus: import("@prisma/client").$Enums.OnboardingStatus;
        isAvailable: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        earnings: import("@prisma/client-runtime-utils").Decimal;
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
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
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        bankDetails: import("@prisma/client/runtime/client").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        onboardingStatus: import("@prisma/client").$Enums.OnboardingStatus;
        isAvailable: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        earnings: import("@prisma/client-runtime-utils").Decimal;
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    getStatus(req: any): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        bankDetails: import("@prisma/client/runtime/client").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        onboardingStatus: import("@prisma/client").$Enums.OnboardingStatus;
        isAvailable: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        earnings: import("@prisma/client-runtime-utils").Decimal;
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
    } | {
        status: string;
    }>;
    updateVehicle(req: any, dto: UpdateVehicleDto): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        bankDetails: import("@prisma/client/runtime/client").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        onboardingStatus: import("@prisma/client").$Enums.OnboardingStatus;
        isAvailable: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        earnings: import("@prisma/client-runtime-utils").Decimal;
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    verifyPartner(partnerId: string, status: OnboardingStatus): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        bankDetails: import("@prisma/client/runtime/client").JsonValue | null;
        emergencyContact: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        onboardingStatus: import("@prisma/client").$Enums.OnboardingStatus;
        isAvailable: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        earnings: import("@prisma/client-runtime-utils").Decimal;
        currentBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
