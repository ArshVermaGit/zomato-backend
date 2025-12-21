import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateModifierDto,
  UpdateModifierDto,
} from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private realtimeGateway: RealtimeGateway,
  ) { }

  // Authorization Helper
  async checkOwnership(userId: string, restaurantId: string) {
    // 1. Get user's partner record
    const partner = await this.prisma.restaurantPartner.findUnique({
      where: { userId },
    });
    if (!partner)
      throw new ForbiddenException('User is not a restaurant partner');

    // 2. Check if restaurant belongs to this partner
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
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
      include: { items: true },
    });
  }

  async createCategory(userId: string, dto: CreateCategoryDto) {
    await this.checkOwnership(userId, dto.restaurantId);

    // Calculate next display order
    const count = await this.prisma.menuCategory.count({
      where: { restaurantId: dto.restaurantId },
    });

    return this.prisma.menuCategory.create({
      data: {
        ...dto,
        displayOrder: count + 1,
      },
    });
  }

  async updateCategory(userId: string, id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    await this.checkOwnership(userId, category.restaurantId);

    return this.prisma.menuCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(userId: string, id: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    await this.checkOwnership(userId, category.restaurantId);

    return this.prisma.menuCategory.delete({ where: { id } });
  }

  async reorderCategory(userId: string, id: string, dto: ReorderCategoryDto) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });
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
      data: { displayOrder: dto.newDisplayOrder },
    });
  }

  // Items
  async getItems(categoryId: string) {
    return this.prisma.menuItem.findMany({
      where: { categoryId },
    });
  }

  async createItem(userId: string, dto: CreateMenuItemDto) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const partner = await this.prisma.restaurantPartner.findUnique({
      where: { userId },
    });
    if (!partner)
      throw new ForbiddenException('User is not a restaurant partner');

    return this.addMenuItem(category.restaurantId, partner.id, dto);
  }

  // ============= ADD MENU ITEM =============
  async addMenuItem(
    restaurantId: string,
    partnerId: string,
    dto: CreateMenuItemDto,
  ) {
    // 1. Verify restaurant ownership
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id: restaurantId, partnerId },
    });

    if (!restaurant) {
      throw new ForbiddenException('You do not own this restaurant');
    }

    // 2. Upload images
    const uploadedImages: string[] = [];
    if (dto.images && dto.images.length > 0) {
      for (const imageBody of dto.images) {
        // Handle Base64 images
        let body: Buffer | string = imageBody;
        let contentType = 'image/jpeg';

        if (imageBody.startsWith('data:image')) {
          const matches = imageBody.match(
            /^data:(image\/[a-zA-Z+]+);base64,(.+)$/,
          );
          if (matches && matches.length === 3) {
            contentType = matches[1];
            body = Buffer.from(matches[2], 'base64');
          }
        } else {
          // Assume raw base64 or url? If url, we shouldn't upload it again usually, or maybe fetch and upload?
          // Assuming raw base64 if not data url
          try {
            body = Buffer.from(imageBody, 'base64');
          } catch (_e) {
            // Fallback to string if failed
            body = imageBody;
          }
        }

        const key = `menu-items/${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpeg`;
        const url = await this.s3Service.uploadBuffer(
          key,
          body as Buffer,
          contentType,
        );
        uploadedImages.push(url);
      }
    }

    // 3. Create menu item
    const item = await this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        images: uploadedImages,
        isVeg: dto.isVeg,
        // Default values
        isAvailable: true,
        isBestseller: false,
        categoryId: dto.categoryId,
      },
      include: {
        category: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    // 4. Create modifiers if provided
    if (dto.modifiers && dto.modifiers.length > 0) {
      // Need to map DTO options to JSON if Prisma expects Json
      // or if Prisma schema defines options as Json.
      // Based on createModifier below, it does JSON.parse(JSON.stringify(options)).

      await this.prisma.menuModifier.createMany({
        data: dto.modifiers.map((mod) => ({
          name: mod.name,
          isRequired: mod.isRequired,
          options: JSON.parse(JSON.stringify(mod.options)),
          menuItemId: item.id,
        })),
      });
    }

    // 5. ⭐ BROADCAST TO ALL CUSTOMER APPS - New menu item available!
    this.realtimeGateway.server.to('role:CUSTOMER').emit('menu:item_added', {
      restaurantId,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        images: item.images,
        isVeg: item.isVeg,
      },
    });

    return item;
  }

  async updateItem(userId: string, id: string, dto: UpdateMenuItemDto) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    await this.checkOwnership(userId, item.category.restaurantId);

    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
    });
  }

  async deleteItem(userId: string, id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    await this.checkOwnership(userId, item.category.restaurantId);

    return this.prisma.menuItem.delete({ where: { id } });
  }

  async toggleAvailability(userId: string, id: string) {
    // Resolve params for new method
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: { include: { restaurant: true } } },
    });
    if (!item) throw new NotFoundException('Item not found');

    // Check ownership
    const partner = await this.prisma.restaurantPartner.findUnique({
      where: { userId },
    });
    if (!partner)
      throw new ForbiddenException('User is not a restaurant partner');

    if (item.category.restaurant.partnerId !== partner.id) {
      throw new ForbiddenException('You do not own this restaurant');
    }

    return this.toggleItemAvailability(
      id,
      item.category.restaurantId,
      partner.id,
    );
  }

  // ============= UPDATE MENU ITEM AVAILABILITY =============
  async toggleItemAvailability(
    itemId: string,
    restaurantId: string,
    partnerId: string,
  ) {
    // 1. Get current item
    const item = await this.prisma.menuItem.findFirst({
      where: {
        id: itemId,
        category: {
          restaurantId,
          restaurant: {
            partnerId,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    // 2. Toggle availability
    const updated = await this.prisma.menuItem.update({
      where: { id: itemId },
      data: { isAvailable: !item.isAvailable },
    });

    // 3. ⭐ INSTANT UPDATE TO ALL CUSTOMER APPS
    this.realtimeGateway.server
      .to('role:CUSTOMER')
      .emit('menu:item_availability_changed', {
        restaurantId,
        itemId: updated.id,
        isAvailable: updated.isAvailable,
      });

    return updated;
  }

  // ============= BULK UPDATE AVAILABILITY =============
  async bulkToggleAvailability(
    restaurantId: string,
    partnerId: string,
    itemIds: string[],
    isAvailable: boolean,
  ) {
    // 1. Verify ownership
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id: restaurantId, partnerId },
    });

    if (!restaurant) {
      throw new ForbiddenException('Unauthorized');
    }

    // 2. Update all items
    await this.prisma.menuItem.updateMany({
      where: {
        id: { in: itemIds },
        category: { restaurantId },
      },
      data: { isAvailable },
    });

    // 3. ⭐ NOTIFY ALL CUSTOMERS
    this.realtimeGateway.server.to('role:CUSTOMER').emit('menu:bulk_update', {
      restaurantId,
      itemIds,
      isAvailable,
    });

    return { success: true, updatedCount: itemIds.length };
  }

  // async getUploadUrl(userId: string, itemId: string) {
  //     // Legacy method - removed in favor of direct upload via addMenuItem
  //     throw new BadRequestException('Use addMenuItem to upload images');
  // }

  async addImage(userId: string, itemId: string, imageUrl: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    await this.checkOwnership(userId, item.category.restaurantId);

    const images = item.images || [];
    images.push(imageUrl);

    return this.prisma.menuItem.update({
      where: { id: itemId },
      data: { images },
    });
  }

  // Modifiers
  async getModifiers(itemId: string) {
    return this.prisma.menuModifier.findMany({
      where: { menuItemId: itemId },
    });
  }

  async createModifier(userId: string, dto: CreateModifierDto) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: dto.menuItemId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    await this.checkOwnership(userId, item.category.restaurantId);

    // Convert options DTO to Json
    const optionsJson = JSON.parse(JSON.stringify(dto.options));

    return this.prisma.menuModifier.create({
      data: {
        name: dto.name,
        isRequired: dto.isRequired,
        menuItemId: dto.menuItemId,
        options: optionsJson,
      },
    });
  }

  async updateModifier(userId: string, id: string, dto: UpdateModifierDto) {
    const modifier = await this.prisma.menuModifier.findUnique({
      where: { id },
      include: { menuItem: { include: { category: true } } },
    });
    if (!modifier) throw new NotFoundException('Modifier not found');
    await this.checkOwnership(userId, modifier.menuItem.category.restaurantId);

    const data: any = { ...dto };
    if (dto.options) {
      data.options = JSON.parse(JSON.stringify(dto.options));
    }

    return this.prisma.menuModifier.update({
      where: { id },
      data,
    });
  }

  async deleteModifier(userId: string, id: string) {
    const modifier = await this.prisma.menuModifier.findUnique({
      where: { id },
      include: { menuItem: { include: { category: true } } },
    });
    if (!modifier) throw new NotFoundException('Modifier not found');
    await this.checkOwnership(userId, modifier.menuItem.category.restaurantId);

    return this.prisma.menuModifier.delete({ where: { id } });
  }
}
