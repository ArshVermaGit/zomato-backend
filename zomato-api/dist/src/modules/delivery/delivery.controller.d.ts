import { DeliveryService } from './delivery.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { EarningsService } from './earnings.service';
import { OnboardingStatus } from '@prisma/client';
export declare class DeliveryController {
    private deliveryService;
    private earningsService;
    constructor(deliveryService: DeliveryService, earningsService: EarningsService);
    getEarnings(req: any): Promise<{
        currentBalance: any;
        totalEarnings: any;
    }>;
    getTransactions(req: any): Promise<any>;
    requestPayout(req: any, amount: number): Promise<any>;
    getPayoutHistory(req: any): Promise<any>;
    getPerformance(req: any): Promise<{
        totalDeliveries: number;
        averageRating: number;
        acceptanceRate: number;
        onTimeRate: number;
        lifetimeEarnings: any;
    }>;
    onboard(req: any, dto: OnboardDeliveryPartnerDto): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
        availableBalance: import("@prisma/client-runtime-utils").Decimal;
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
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
        availableBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    getStatus(req: any): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
        availableBalance: import("@prisma/client-runtime-utils").Decimal;
    } | {
        status: string;
    }>;
    updateVehicle(req: any, dto: UpdateVehicleDto): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
        availableBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    verifyPartner(partnerId: string, status: OnboardingStatus): Promise<{
        id: string;
        userId: string;
        vehicleType: import("@prisma/client").$Enums.VehicleType;
        vehicleNumber: string;
        licenseNumber: string;
        isAvailable: boolean;
        isOnline: boolean;
        currentLocation: import("@prisma/client/runtime/client").JsonValue | null;
        documentsVerified: boolean;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalDeliveries: number;
        totalEarnings: import("@prisma/client-runtime-utils").Decimal;
        availableBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
