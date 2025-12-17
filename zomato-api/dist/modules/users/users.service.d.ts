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
    getProfile(userId: string): unknown;
    updateProfile(userId: string, dto: UpdateProfileDto): unknown;
    getAvatarUploadUrl(userId: string): unknown;
    updateAvatar(userId: string, avatarUrl: string): unknown;
    createAddress(userId: string, dto: CreateAddressDto): Promise<Address>;
    getAddresses(userId: string): Promise<Address[]>;
    updateAddress(userId: string, addressId: string, dto: UpdateAddressDto): Promise<Address>;
    deleteAddress(userId: string, addressId: string): unknown;
    setDefaultAddress(userId: string, addressId: string): unknown;
}
