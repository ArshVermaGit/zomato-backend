import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
export declare class MenuService {
    private prisma;
    private s3Service;
    constructor(prisma: PrismaService, s3Service: S3Service);
    checkOwnership(userId: string, restaurantId: string): unknown;
    getCategories(restaurantId: string): unknown;
    createCategory(userId: string, dto: CreateCategoryDto): unknown;
    updateCategory(userId: string, id: string, dto: UpdateCategoryDto): unknown;
    deleteCategory(userId: string, id: string): unknown;
    reorderCategory(userId: string, id: string, dto: ReorderCategoryDto): unknown;
    getItems(categoryId: string): unknown;
    createItem(userId: string, dto: CreateMenuItemDto): unknown;
    updateItem(userId: string, id: string, dto: UpdateMenuItemDto): unknown;
    deleteItem(userId: string, id: string): unknown;
    toggleAvailability(userId: string, id: string): unknown;
    getUploadUrl(userId: string, itemId: string): unknown;
    addImage(userId: string, itemId: string, imageUrl: string): unknown;
    getModifiers(itemId: string): unknown;
    createModifier(userId: string, dto: CreateModifierDto): unknown;
    updateModifier(userId: string, id: string, dto: UpdateModifierDto): unknown;
    deleteModifier(userId: string, id: string): unknown;
}
