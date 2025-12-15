import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { S3Service } from '../../common/services/s3.service';
import { LocationService } from './location.service';
import { OrderStateService } from '../orders/order-state.service';
import { EarningsService } from './earnings.service';
import { OnboardingStatus, OrderStatus, UserRole, TransactionType, TransactionCategory } from '@prisma/client';

@Injectable()
export class DeliveryService {
    constructor(
        private prisma: PrismaService,
        private s3Service: S3Service,
        private locationService: LocationService,
        // Use forwardRef if circular dependency exists, or ensure module structure is clean. 
        // OrdersModule exports OrderStateService, so we can inject if imported in DeliveryModule.
        // But we will need to import OrdersModule in DeliveryModule.
        @Inject(forwardRef(() => OrderStateService))
        private orderStateService: OrderStateService,
        @Inject(forwardRef(() => EarningsService))
        private earningsService: EarningsService
    ) { }

    async onboard(userId: string, dto: OnboardDeliveryPartnerDto) {
        // Upsert: Create if not exists, Update if exists (but only if not Verified?)
        // Check existing status
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
                bankDetails: dto.bankDetails as any, // Typed JSON in DTO, stored as Json in Prisma
                emergencyContact: dto.emergencyContact as any,
                onboardingStatus: OnboardingStatus.PENDING, // Move to Pending once details submitted
                documents: {} // Initialize empty doc map
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
        // Doc types: license_front, license_back, aadhaar_front, aadhaar_back, rc, profile_photo
        const validTypes = ['license_front', 'license_back', 'aadhaar_front', 'aadhaar_back', 'rc', 'profile_photo'];
        if (!validTypes.includes(docType)) {
            throw new BadRequestException(`Invalid document type. Valid types: ${validTypes.join(', ')}`);
        }

        const key = `delivery-docs/${userId}/${docType}-${Date.now()}.jpeg`;
        const uploadUrl = await this.s3Service.getSignedUploadUrl(key);
        const publicUrl = this.s3Service.getPublicUrl(key);

        // We don't save DB URL yet, client must call an endpoint to confirm upload OR we trust the key structure.
        // Better pattern: Client uploads, then calls "updateDocument" with the key/url. 
        // But for simplicity request says "POST /delivery/documents/upload (upload documents)".
        // Let's assume this endpoint returns URL, client uploads, then client calls "POST /delivery/documents/confirm" or similar
        // OR we just return the key/publicUrl and assume client sets it in a separate call? 
        // Plan said: "POST /delivery/documents/upload". 
        // Let's stick to returning signed URL, and maybe have a method to update the doc status in DB.

        return { uploadUrl, publicUrl, key };
    }

    async updateDocumentStatus(userId: string, docType: string, url: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) throw new NotFoundException('Partner record not found. Please onboard first.');

        const currentDocs = (partner.documents as any) || {};
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

    async getStatus(userId: string) {
        const partner = await this.prisma.deliveryPartner.findUnique({ where: { userId } });
        if (!partner) return { status: 'NOT_STARTED' };
        return partner;
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
        if (![OnboardingStatus.VERIFIED, OnboardingStatus.REJECTED].includes(status as any)) {
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
