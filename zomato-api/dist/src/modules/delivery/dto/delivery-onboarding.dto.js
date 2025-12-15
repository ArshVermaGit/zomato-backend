"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleDto = exports.OnboardDeliveryPartnerDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class BankDetailsDto {
    accountName;
    accountNumber;
    ifscCode;
    bankName;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "accountName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC0001234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "ifscCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HDFC Bank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BankDetailsDto.prototype, "bankName", void 0);
class EmergencyContactDto {
    name;
    phone;
    relation;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jane Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9999999999' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sister' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relation", void 0);
class OnboardDeliveryPartnerDto {
    vehicleType;
    vehicleNumber;
    licenseNumber;
    bankDetails;
    emergencyContact;
}
exports.OnboardDeliveryPartnerDto = OnboardDeliveryPartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.VehicleType }),
    (0, class_validator_1.IsEnum)(client_1.VehicleType),
    __metadata("design:type", String)
], OnboardDeliveryPartnerDto.prototype, "vehicleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DL 10 AB 1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OnboardDeliveryPartnerDto.prototype, "vehicleNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LIC-123456789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OnboardDeliveryPartnerDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BankDetailsDto }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BankDetailsDto),
    __metadata("design:type", BankDetailsDto)
], OnboardDeliveryPartnerDto.prototype, "bankDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EmergencyContactDto }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    __metadata("design:type", EmergencyContactDto)
], OnboardDeliveryPartnerDto.prototype, "emergencyContact", void 0);
class UpdateVehicleDto {
    vehicleType;
    vehicleNumber;
}
exports.UpdateVehicleDto = UpdateVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.VehicleType }),
    (0, class_validator_1.IsEnum)(client_1.VehicleType),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "vehicleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DL 10 AB 1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "vehicleNumber", void 0);
//# sourceMappingURL=delivery-onboarding.dto.js.map