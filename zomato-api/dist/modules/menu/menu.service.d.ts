import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
export declare class MenuService {
    private prisma;
    private s3Service;
    private realtimeGateway;
    constructor(prisma: PrismaService, s3Service: S3Service, realtimeGateway: RealtimeGateway);
    checkOwnership(userId: string, restaurantId: string): Promise<boolean>;
    getCategories(restaurantId: string): Promise<any>;
    createCategory(userId: string, dto: CreateCategoryDto): Promise<any>;
    updateCategory(userId: string, id: string, dto: UpdateCategoryDto): Promise<any>;
    deleteCategory(userId: string, id: string): Promise<any>;
    reorderCategory(userId: string, id: string, dto: ReorderCategoryDto): Promise<any>;
    getItems(categoryId: string): Promise<any>;
    createItem(userId: string, dto: CreateMenuItemDto): Promise<any>;
    addMenuItem(restaurantId: string, partnerId: string, dto: CreateMenuItemDto): Promise<any>;
    updateItem(userId: string, id: string, dto: UpdateMenuItemDto): Promise<any>;
    deleteItem(userId: string, id: string): Promise<any>;
    toggleAvailability(userId: string, id: string): Promise<any>;
    toggleItemAvailability(itemId: string, restaurantId: string, partnerId: string): Promise<any>;
    bulkToggleAvailability(restaurantId: string, partnerId: string, itemIds: string[], isAvailable: boolean): Promise<{
        success: boolean;
        updatedCount: number;
    }>;
    addImage(userId: string, itemId: string, imageUrl: string): Promise<any>;
    getModifiers(itemId: string): Promise<any>;
    createModifier(userId: string, dto: CreateModifierDto): Promise<any>;
    updateModifier(userId: string, id: string, dto: UpdateModifierDto): Promise<any>;
    deleteModifier(userId: string, id: string): Promise<any>;
}
