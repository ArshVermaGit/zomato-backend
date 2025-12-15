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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const s3_service_1 = require("../../common/services/s3.service");
let MenuService = class MenuService {
    prisma;
    s3Service;
    constructor(prisma, s3Service) {
        this.prisma = prisma;
        this.s3Service = s3Service;
    }
    async checkOwnership(userId, restaurantId) {
        const partner = await this.prisma.restaurantPartner.findUnique({ where: { userId } });
        if (!partner)
            throw new common_1.ForbiddenException('User is not a restaurant partner');
        const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        if (restaurant.partnerId !== partner.id) {
            throw new common_1.ForbiddenException('You do not own this restaurant');
        }
        return true;
    }
    async getCategories(restaurantId) {
        return this.prisma.menuCategory.findMany({
            where: { restaurantId },
            orderBy: { displayOrder: 'asc' },
            include: { items: true }
        });
    }
    async createCategory(userId, dto) {
        await this.checkOwnership(userId, dto.restaurantId);
        const count = await this.prisma.menuCategory.count({ where: { restaurantId: dto.restaurantId } });
        return this.prisma.menuCategory.create({
            data: {
                ...dto,
                displayOrder: count + 1
            }
        });
    }
    async updateCategory(userId, id, dto) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);
        return this.prisma.menuCategory.update({
            where: { id },
            data: dto
        });
    }
    async deleteCategory(userId, id) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);
        return this.prisma.menuCategory.delete({ where: { id } });
    }
    async reorderCategory(userId, id, dto) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);
        return this.prisma.menuCategory.update({
            where: { id },
            data: { displayOrder: dto.newDisplayOrder }
        });
    }
    async getItems(categoryId) {
        return this.prisma.menuItem.findMany({
            where: { categoryId }
        });
    }
    async createItem(userId, dto) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id: dto.categoryId } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);
        return this.prisma.menuItem.create({
            data: { ...dto, images: [] }
        });
    }
    async updateItem(userId, id, dto) {
        const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);
        return this.prisma.menuItem.update({
            where: { id },
            data: dto
        });
    }
    async deleteItem(userId, id) {
        const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);
        return this.prisma.menuItem.delete({ where: { id } });
    }
    async toggleAvailability(userId, id) {
        const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);
        return this.prisma.menuItem.update({
            where: { id },
            data: { isAvailable: !item.isAvailable }
        });
    }
    async getUploadUrl(userId, itemId) {
        const item = await this.prisma.menuItem.findUnique({ where: { id: itemId }, include: { category: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);
        const key = `menu-items/${itemId}-${Date.now()}.jpeg`;
        const uploadUrl = await this.s3Service.getSignedUploadUrl(key);
        const publicUrl = this.s3Service.getPublicUrl(key);
        return { uploadUrl, publicUrl, key };
    }
    async addImage(userId, itemId, imageUrl) {
        const item = await this.prisma.menuItem.findUnique({ where: { id: itemId }, include: { category: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);
        const images = item.images || [];
        images.push(imageUrl);
        return this.prisma.menuItem.update({
            where: { id: itemId },
            data: { images }
        });
    }
    async getModifiers(itemId) {
        return this.prisma.menuModifier.findMany({
            where: { menuItemId: itemId }
        });
    }
    async createModifier(userId, dto) {
        const item = await this.prisma.menuItem.findUnique({ where: { id: dto.menuItemId }, include: { category: true } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);
        const optionsJson = JSON.parse(JSON.stringify(dto.options));
        return this.prisma.menuModifier.create({
            data: {
                name: dto.name,
                isRequired: dto.isRequired,
                menuItemId: dto.menuItemId,
                options: optionsJson
            }
        });
    }
    async updateModifier(userId, id, dto) {
        const modifier = await this.prisma.menuModifier.findUnique({
            where: { id },
            include: { menuItem: { include: { category: true } } }
        });
        if (!modifier)
            throw new common_1.NotFoundException('Modifier not found');
        await this.checkOwnership(userId, modifier.menuItem.category.restaurantId);
        const data = { ...dto };
        if (dto.options) {
            data.options = JSON.parse(JSON.stringify(dto.options));
        }
        return this.prisma.menuModifier.update({
            where: { id },
            data
        });
    }
    async deleteModifier(userId, id) {
        const modifier = await this.prisma.menuModifier.findUnique({
            where: { id },
            include: { menuItem: { include: { category: true } } }
        });
        if (!modifier)
            throw new common_1.NotFoundException('Modifier not found');
        await this.checkOwnership(userId, modifier.menuItem.category.restaurantId);
        return this.prisma.menuModifier.delete({ where: { id } });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], MenuService);
//# sourceMappingURL=menu.service.js.map