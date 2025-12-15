import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
    constructor(
        private prisma: PrismaService,
        private s3Service: S3Service
    ) { }

    // Authorization Helper
    async checkOwnership(userId: string, restaurantId: string) {
        // 1. Get user's partner record
        const partner = await this.prisma.restaurantPartner.findUnique({ where: { userId } });
        if (!partner) throw new ForbiddenException('User is not a restaurant partner');

        // 2. Check if restaurant belongs to this partner
        const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) throw new NotFoundException('Restaurant not found');

        if (restaurant.partnerId !== partner.id) {
            throw new ForbiddenException('You do not own this restaurant');
        }
        return true;
    }

    // Categories
    async getCategories(restaurantId: string) {
        return this.prisma.menuCategory.findMany({
            where: { restaurantId },
            orderBy: { displayOrder: 'asc' }, // Ensure ordered
            include: { items: true }
        });
    }

    async createCategory(userId: string, dto: CreateCategoryDto) {
        await this.checkOwnership(userId, dto.restaurantId);

        // Calculate next display order
        const count = await this.prisma.menuCategory.count({ where: { restaurantId: dto.restaurantId } });

        return this.prisma.menuCategory.create({
            data: {
                ...dto,
                displayOrder: count + 1
            }
        });
    }

    async updateCategory(userId: string, id: string, dto: UpdateCategoryDto) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);

        return this.prisma.menuCategory.update({
            where: { id },
            data: dto
        });
    }

    async deleteCategory(userId: string, id: string) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);

        return this.prisma.menuCategory.delete({ where: { id } });
    }

    async reorderCategory(userId: string, id: string, dto: ReorderCategoryDto) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);

        // Simple implementation: Update this one, strictly implies others might need shifting
        // or just update the value. 
        // For drag and drop, usually we receive a list of IDs in order or just update one.
        // Requirement: "PUT /menu/categories/:id/reorder"
        // Let's implement creating a gap or simple update. 
        // Better: Shift others.

        // Transaction to handle shifting is complex. 
        // For MVP, just update the integer. Frontend handles collisions or we re-normalize later.
        return this.prisma.menuCategory.update({
            where: { id },
            data: { displayOrder: dto.newDisplayOrder }
        });
    }

    // Items
    async getItems(categoryId: string) {
        return this.prisma.menuItem.findMany({
            where: { categoryId }
        });
    }

    async createItem(userId: string, dto: CreateMenuItemDto) {
        const category = await this.prisma.menuCategory.findUnique({ where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('Category not found');
        await this.checkOwnership(userId, category.restaurantId);

        return this.prisma.menuItem.create({
            data: { ...dto, images: [] }
        });
    }

    async updateItem(userId: string, id: string, dto: UpdateMenuItemDto) {
        const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
        if (!item) throw new NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);

        return this.prisma.menuItem.update({
            where: { id },
            data: dto
        });
    }

    async deleteItem(userId: string, id: string) {
        const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
        if (!item) throw new NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);

        return this.prisma.menuItem.delete({ where: { id } });
    }

    async toggleAvailability(userId: string, id: string) {
        const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
        if (!item) throw new NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);

        return this.prisma.menuItem.update({
            where: { id },
            data: { isAvailable: !item.isAvailable }
        });
    }

    async getUploadUrl(userId: string, itemId: string) {
        const item = await this.prisma.menuItem.findUnique({ where: { id: itemId }, include: { category: true } });
        if (!item) throw new NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);

        const key = `menu-items/${itemId}-${Date.now()}.jpeg`;
        const uploadUrl = await this.s3Service.getSignedUploadUrl(key);
        const publicUrl = this.s3Service.getPublicUrl(key);

        // We can append to images list here or wait for explicit update? 
        // Let's optimize flow: return URL, client uploads, then client calls PUT to add image URL?
        // Or we assume successful upload and add it now? No, insecure.
        // Better: Return URL, let client upload. Client then calls `updateItem` with new image list.
        // Or implemented specific `addImage` endpoint?

        return { uploadUrl, publicUrl, key };
    }

    async addImage(userId: string, itemId: string, imageUrl: string) {
        const item = await this.prisma.menuItem.findUnique({ where: { id: itemId }, include: { category: true } });
        if (!item) throw new NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);

        const images = item.images || [];
        images.push(imageUrl);

        return this.prisma.menuItem.update({
            where: { id: itemId },
            data: { images }
        });
    }

    // Modifiers
    async getModifiers(itemId: string) {
        return this.prisma.menuModifier.findMany({
            where: { menuItemId: itemId }
        });
    }

    async createModifier(userId: string, dto: CreateModifierDto) {
        const item = await this.prisma.menuItem.findUnique({ where: { id: dto.menuItemId }, include: { category: true } });
        if (!item) throw new NotFoundException('Item not found');
        await this.checkOwnership(userId, item.category.restaurantId);

        // Convert options DTO to Json
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

    async updateModifier(userId: string, id: string, dto: UpdateModifierDto) {
        const modifier = await this.prisma.menuModifier.findUnique({
            where: { id },
            include: { menuItem: { include: { category: true } } }
        });
        if (!modifier) throw new NotFoundException('Modifier not found');
        await this.checkOwnership(userId, modifier.menuItem.category.restaurantId);

        const data: any = { ...dto };
        if (dto.options) {
            data.options = JSON.parse(JSON.stringify(dto.options));
        }

        return this.prisma.menuModifier.update({
            where: { id },
            data
        });
    }

    async deleteModifier(userId: string, id: string) {
        const modifier = await this.prisma.menuModifier.findUnique({
            where: { id },
            include: { menuItem: { include: { category: true } } }
        });
        if (!modifier) throw new NotFoundException('Modifier not found');
        await this.checkOwnership(userId, modifier.menuItem.category.restaurantId);

        return this.prisma.menuModifier.delete({ where: { id } });
    }
}
