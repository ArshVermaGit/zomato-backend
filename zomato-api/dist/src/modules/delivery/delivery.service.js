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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const s3_service_1 = require("../../common/services/s3.service");
const location_service_1 = require("./location.service");
const order_state_service_1 = require("../orders/order-state.service");
const earnings_service_1 = require("./earnings.service");
const client_1 = require("@prisma/client");
let DeliveryService = class DeliveryService {
    prisma;
    s3Service;
    locationService;
    orderStateService;
    earningsService;
    constructor(prisma, s3Service, locationService, orderStateService, earningsService) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.locationService = locationService;
        this.orderStateService = orderStateService;
        this.earningsService = earningsService;
    }
    async onboard(userId, dto) {
        const existing = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (existing && existing.onboardingStatus === client_1.OnboardingStatus.VERIFIED) {
            throw new common_1.BadRequestException('Already onboarded and verified');
        }
        return this.prisma.deliveryPartner.upsert({
            where: { userId },
            create: {
                userId,
                vehicleType: dto.vehicleType,
                vehicleNumber: dto.vehicleNumber,
                licenseNumber: dto.licenseNumber,
                bankDetails: dto.bankDetails,
                emergencyContact: dto.emergencyContact,
                onboardingStatus: client_1.OnboardingStatus.PENDING,
                documents: {}
            },
            update: {
                vehicleType: dto.vehicleType,
                vehicleNumber: dto.vehicleNumber,
                licenseNumber: dto.licenseNumber,
                bankDetails: dto.bankDetails,
                emergencyContact: dto.emergencyContact,
                onboardingStatus: client_1.OnboardingStatus.PENDING
            }
        });
    }
    async getUploadUrl(userId, docType) {
        const validTypes = ['license_front', 'license_back', 'aadhaar_front', 'aadhaar_back', 'rc', 'profile_photo'];
        if (!validTypes.includes(docType)) {
            throw new common_1.BadRequestException(`Invalid document type. Valid types: ${validTypes.join(', ')}`);
        }
        const key = `delivery-docs/${userId}/${docType}-${Date.now()}.jpeg`;
        const uploadUrl = await this.s3Service.getSignedUploadUrl(key);
        const publicUrl = this.s3Service.getPublicUrl(key);
        return { uploadUrl, publicUrl, key };
    }
    async updateDocumentStatus(userId, docType, url) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.NotFoundException('Partner record not found. Please onboard first.');
        const currentDocs = partner.documents || {};
        currentDocs[docType] = {
            url,
            status: 'UPLOADED',
            uploadedAt: new Date()
        };
        return this.prisma.deliveryPartner.update({
            where: { userId },
            data: { documents: currentDocs }
        });
    }
    async getStatus(userId) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            return { status: 'NOT_STARTED' };
        return partner;
    }
    async updateVehicle(userId, dto) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.NotFoundException('Partner not found');
        return this.prisma.deliveryPartner.update({
            where: { userId },
            data: {
                vehicleType: dto.vehicleType,
                vehicleNumber: dto.vehicleNumber
            }
        });
    }
    async verifyPartner(partnerId, status) {
        if (![client_1.OnboardingStatus.VERIFIED, client_1.OnboardingStatus.REJECTED].includes(status)) {
            throw new common_1.BadRequestException('Invalid status for verification');
        }
        return this.prisma.deliveryPartner.update({
            where: { id: partnerId },
            data: {
                onboardingStatus: status,
                documentsVerified: status === client_1.OnboardingStatus.VERIFIED,
                isAvailable: status === client_1.OnboardingStatus.VERIFIED
            }
        });
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => order_state_service_1.OrderStateService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => earnings_service_1.EarningsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service,
        location_service_1.LocationService,
        order_state_service_1.OrderStateService,
        earnings_service_1.EarningsService])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map