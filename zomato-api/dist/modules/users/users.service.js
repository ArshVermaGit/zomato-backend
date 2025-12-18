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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const s3_service_1 = require("../../common/services/s3.service");
const geocoding_service_1 = require("../../common/services/geocoding.service");
let UsersService = class UsersService {
    prisma;
    s3Service;
    geocodingService;
    constructor(prisma, s3Service, geocodingService) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.geocodingService = geocodingService;
    }
    async findOneByPhone(phone) {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }
    async findOneById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { password, ...result } = user;
        return result;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { ...dto }
        });
        const { password, ...result } = user;
        return result;
    }
    async getAvatarUploadUrl(userId) {
        const key = `avatars/${userId}-${Date.now()}.jpeg`;
        throw new Error('Please implement direct file upload for user profile');
    }
    async updateAvatar(userId, avatarUrl) {
        return this.update(userId, { avatar: avatarUrl });
    }
    async createAddress(userId, dto) {
        let location = dto.location;
        if (!location && !dto.lat && !dto.lng && dto.fullAddress) {
            const coords = await this.geocodingService.getCoordinates(dto.fullAddress);
            if (coords) {
                location = coords;
            }
            else {
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
                location: location || {},
                isDefault: false
            }
        });
    }
    async getAddresses(userId) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateAddress(userId, addressId, dto) {
        const data = { ...dto };
        if (dto.lat && dto.lng) {
            data.location = { lat: dto.lat, lng: dto.lng };
            delete data.lat;
            delete data.lng;
        }
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        return this.prisma.address.update({
            where: { id: addressId },
            data
        });
    }
    async deleteAddress(userId, addressId) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        return this.prisma.address.delete({
            where: { id: addressId }
        });
    }
    async setDefaultAddress(userId, addressId) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service,
        geocoding_service_1.GeocodingService])
], UsersService);
//# sourceMappingURL=users.service.js.map