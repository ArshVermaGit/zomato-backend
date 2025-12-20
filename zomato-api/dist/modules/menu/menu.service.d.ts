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
    getCategories(restaurantId: string): Promise<({
        items: {
            id: string;
            name: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            isVeg: boolean;
            isAvailable: boolean;
            isBestseller: boolean;
            categoryId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    })[]>;
    createCategory(userId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    updateCategory(userId: string, id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    deleteCategory(userId: string, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    reorderCategory(userId: string, id: string, dto: ReorderCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    getItems(categoryId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }[]>;
    createItem(userId: string, dto: CreateMenuItemDto): Promise<{
        category: {
            restaurant: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                images: string[];
                cuisineTypes: string[];
                phone: string;
                email: string;
                location: import("@prisma/client/runtime/library").JsonValue;
                isOpen: boolean;
                rating: import("@prisma/client/runtime/library").Decimal;
                totalRatings: number;
                preparationTime: number;
                minimumOrder: import("@prisma/client/runtime/library").Decimal;
                deliveryFee: import("@prisma/client/runtime/library").Decimal;
                deliveryRadius: import("@prisma/client/runtime/library").Decimal;
                coverImage: string | null;
                partnerId: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            displayOrder: number;
            restaurantId: string;
            isActive: boolean;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    addMenuItem(restaurantId: string, partnerId: string, dto: CreateMenuItemDto): Promise<{
        category: {
            restaurant: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                images: string[];
                cuisineTypes: string[];
                phone: string;
                email: string;
                location: import("@prisma/client/runtime/library").JsonValue;
                isOpen: boolean;
                rating: import("@prisma/client/runtime/library").Decimal;
                totalRatings: number;
                preparationTime: number;
                minimumOrder: import("@prisma/client/runtime/library").Decimal;
                deliveryFee: import("@prisma/client/runtime/library").Decimal;
                deliveryRadius: import("@prisma/client/runtime/library").Decimal;
                coverImage: string | null;
                partnerId: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            displayOrder: number;
            restaurantId: string;
            isActive: boolean;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    updateItem(userId: string, id: string, dto: UpdateMenuItemDto): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    deleteItem(userId: string, id: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    toggleAvailability(userId: string, id: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    toggleItemAvailability(itemId: string, restaurantId: string, partnerId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    bulkToggleAvailability(restaurantId: string, partnerId: string, itemIds: string[], isAvailable: boolean): Promise<{
        success: boolean;
        updatedCount: number;
    }>;
    addImage(userId: string, itemId: string, imageUrl: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        isVeg: boolean;
        isAvailable: boolean;
        isBestseller: boolean;
        categoryId: string;
    }>;
    getModifiers(itemId: string): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }[]>;
    createModifier(userId: string, dto: CreateModifierDto): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }>;
    updateModifier(userId: string, id: string, dto: UpdateModifierDto): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }>;
    deleteModifier(userId: string, id: string): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }>;
}
