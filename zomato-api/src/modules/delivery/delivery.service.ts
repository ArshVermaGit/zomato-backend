import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { S3Service } from '../../common/services/s3.service';
import { LocationService } from './location.service';
import { OrderStateService } from '../orders/order-state.service';
import { EarningsService } from './earnings.service';
import { OnboardingStatus, OrderStatus, UserRole, DocumentType, DocumentStatus } from '@prisma/client';

@Injectable()
export class DeliveryService {
    constructor(
        private prisma: PrismaService,
        private s3Service: S3Service,
        private locationService: LocationService,
        @Inject(forwardRef(() => OrderStateService))
        private orderStateService: OrderStateService,
        @Inject(forwardRef(() => EarningsService))
        private earningsService: EarningsService
    ) { }

    private docTypeMap: Record<string, DocumentType> = {
        'license_front': DocumentType.DRIVERS_LICENSE_FRONT,
        'license_back': DocumentType.DRIVERS_LICENSE_BACK,
        'aadhaar_front': DocumentType.AADHAAR_FRONT,
        'aadhaar_back': DocumentType.AADHAAR_BACK,
        'rc': DocumentType.VEHICLE_RC,
        'profile_photo': DocumentType.PROFILE_PHOTO
    };

    async onboard(userId: string, dto: OnboardDeliveryPartnerDto) {
        const existing = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (existing && existing.onboardingStatus === OnboardingStatus.VERIFIED) {
            throw new BadRequestException('Already onboarded and verified');
        }

        return this.prisma.deliveryPartner.upsert({
            where: { userId },
            create: {
                userId,
                vehicleType: dto.vehicleType,
                vehicleNumber: dto.vehicleNumber,
                licenseNumber: dto.licenseNumber,
                bankDetails: dto.bankDetails as any,
                emergencyContact: dto.emergencyContact as any,
                onboardingStatus: OnboardingStatus.PENDING,
                // documents relation initialized empty by default
            },
            update: {
                vehicleType: dto.vehicleType,
                vehicleNumber: dto.vehicleNumber,
                licenseNumber: dto.licenseNumber,
                bankDetails: dto.bankDetails as any,
                emergencyContact: dto.emergencyContact as any,
                onboardingStatus: OnboardingStatus.PENDING
            }
        });
    }

    async getUploadUrl(userId: string, docType: string) {
        if (!this.docTypeMap[docType]) {
            throw new BadRequestException(`Invalid document type.`);
        }

        const key = `delivery-docs/${userId}/${docType}-${Date.now()}.jpeg`;
        const uploadUrl = await this.s3Service.getSignedUploadUrl(key);
        const publicUrl = this.s3Service.getPublicUrl(key);

        return { uploadUrl, publicUrl, key };
    }

    async updateDocumentStatus(userId: string, docTypeKey: string, url: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner record not found. Please onboard first.');

        const docType = this.docTypeMap[docTypeKey];
        if (!docType) throw new BadRequestException('Invalid document type key');

        // Upsert Document record using logic since we don't have compound unique index exposed in simple create
        // Or if we do: @@unique([deliveryPartnerId, type]) - let's check schema. 
        // Schema doesn't show compound unique. Doing findFirst -> Update/Create.

        const existingDoc = await this.prisma.document.findFirst({
            where: { deliveryPartnerId: partner.id, type: docType }
        });

        if (existingDoc) {
            return this.prisma.document.update({
                where: { id: existingDoc.id },
                data: { fileUrl: url, status: DocumentStatus.PENDING, uploadedAt: new Date() }
            });
        } else {
            return this.prisma.document.create({
                data: {
                    deliveryPartnerId: partner.id,
                    type: docType,
                    fileUrl: url,
                    status: DocumentStatus.PENDING,
                    uploadedAt: new Date()
                }
            });
        }
    }

    async getStatus(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId },
            include: { documents: true }
        });
        if (!partner) return { status: 'NOT_STARTED' };

        // Map documents status
        const docsStatus = {};
        // Reverse map enum to keys? Or just return list
        partner.documents.forEach(doc => {
            // Find key for doc.type (naive reverse lookup)
            const key = Object.keys(this.docTypeMap).find(k => this.docTypeMap[k] === doc.type);
            if (key) docsStatus[key] = doc.status;
        });

        return {
            status: partner.onboardingStatus,
            documents: docsStatus,
            documentsVerified: partner.documentsVerified
        };
    }

    async updateVehicle(userId: string, dto: UpdateVehicleDto) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner not found');

        // If verified, maybe need admin approval? For MVP let's allow update.
        return this.prisma.deliveryPartner.update({
            where: { userId },
            data: {
                vehicleType: dto.vehicleType,
                vehicleNumber: dto.vehicleNumber
            }
        });
    }

    // --- ADMIN METHODS ---

    async verifyPartner(partnerId: string, status: OnboardingStatus) {
        if (!([OnboardingStatus.VERIFIED, OnboardingStatus.REJECTED] as OnboardingStatus[]).includes(status)) {
            throw new BadRequestException('Invalid status for verification');
        }

        return this.prisma.deliveryPartner.update({
            where: { id: partnerId },
            data: {
                onboardingStatus: status,
                documentsVerified: status === OnboardingStatus.VERIFIED,
                isAvailable: status === OnboardingStatus.VERIFIED // Auto enable availability if verified? Or keep separate.
            }
        });
    }
}
