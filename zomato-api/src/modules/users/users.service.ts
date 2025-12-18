import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User, Prisma, Address } from '@prisma/client';
import { S3Service } from '../../common/services/s3.service';
import { GeocodingService } from '../../common/services/geocoding.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private s3Service: S3Service,
        private geocodingService: GeocodingService
    ) { }

    async findOneByPhone(phone: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        // @ts-ignore
        const { password, ...result } = user;
        return result;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { ...dto }
        });
        // @ts-ignore
        const { password, ...result } = user;
        return result;
    }

    async getAvatarUploadUrl(userId: string) {
        const key = `avatars/${userId}-${Date.now()}.jpeg`;
        // const url = await this.s3Service.getSignedUploadUrl(key, 'image/jpeg');
        throw new Error('Please implement direct file upload for user profile');
        // const publicUrl = this.s3Service.getPublicUrl(key);
        // return { uploadUrl: url, publicUrl, key };
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        return this.update(userId, { avatar: avatarUrl });
    }

    async createAddress(userId: string, dto: CreateAddressDto): Promise<Address> {
        let location = dto.location;

        // Auto-geocode if location missing but address present
        if (!location && !dto.lat && !dto.lng && dto.fullAddress) {
            const coords = await this.geocodingService.getCoordinates(dto.fullAddress);
            if (coords) {
                location = coords;
            } else {
                // Default or error? Let's default to null or require FE to send.
                // Requirement says "Geocoding integration for addresses", implies backend can do it.
            }
        }

        if (!location && dto.lat && dto.lng) {
            location = { lat: dto.lat, lng: dto.lng };
        }

        return this.prisma.address.create({
            data: {
                userId,
                label: dto.label,
                fullAddress: dto.fullAddress,
                landmark: dto.landmark,
                location: location || {}, // Prisma JSON
                isDefault: false // Logic to set default if first address?
            }
        });
    }

    async getAddresses(userId: string): Promise<Address[]> {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto): Promise<Address> {
        // Create data object
        const data: any = { ...dto };
        if (dto.lat && dto.lng) {
            data.location = { lat: dto.lat, lng: dto.lng };
            delete data.lat;
            delete data.lng;
        }

        // Check ownership
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address) throw new NotFoundException('Address not found');

        return this.prisma.address.update({
            where: { id: addressId },
            data
        });
    }

    async deleteAddress(userId: string, addressId: string) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address) throw new NotFoundException('Address not found');

        return this.prisma.address.delete({
            where: { id: addressId }
        });
    }

    async setDefaultAddress(userId: string, addressId: string) {
        // Transaction to unset others and set this one
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address) throw new NotFoundException('Address not found');

        await this.prisma.$transaction([
            this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            }),
            this.prisma.address.update({
                where: { id: addressId },
                data: { isDefault: true }
            })
        ]);
        return { message: 'Default address updated' };
    }
}
