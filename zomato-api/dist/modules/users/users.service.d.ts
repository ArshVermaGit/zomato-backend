import { PrismaService } from '../../database/prisma.service';
import { User, Prisma, Address } from '@prisma/client';
import { S3Service } from '../../common/services/s3.service';
import { GeocodingService } from '../../common/services/geocoding.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    private s3Service;
    private geocodingService;
    constructor(prisma: PrismaService, s3Service: S3Service, geocodingService: GeocodingService);
    findOneByPhone(phone: string): Promise<User | null>;
    findOneById(id: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    getProfile(userId: string): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    getAvatarUploadUrl(userId: string): void;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    createAddress(userId: string, dto: CreateAddressDto): Promise<Address>;
    getAddresses(userId: string): Promise<Address[]>;
    updateAddress(userId: string, addressId: string, dto: UpdateAddressDto): Promise<Address>;
    deleteAddress(userId: string, addressId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        fullAddress: string;
        location: Prisma.JsonValue;
        landmark: string | null;
        isDefault: boolean;
    }>;
    setDefaultAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
}
