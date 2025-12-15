import { VehicleType } from '@prisma/client';
declare class BankDetailsDto {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
}
declare class EmergencyContactDto {
    name: string;
    phone: string;
    relation: string;
}
export declare class OnboardDeliveryPartnerDto {
    vehicleType: VehicleType;
    vehicleNumber: string;
    licenseNumber: string;
    bankDetails: BankDetailsDto;
    emergencyContact: EmergencyContactDto;
}
export declare class UpdateVehicleDto {
    vehicleType: VehicleType;
    vehicleNumber: string;
}
export {};
