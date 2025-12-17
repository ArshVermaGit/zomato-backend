import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
import { Prisma } from '@prisma/client';
export declare class MenuService {
    private prisma;
    private s3Service;
    constructor(prisma: PrismaService, s3Service: S3Service);
    checkOwnership(userId: string, restaurantId: string): Promise<boolean>;
    getCategories(restaurantId: string): Promise<({
        items: {
            name: string;
            description: string;
            id: string;
            isAvailable: boolean;
            images: string[];
            price: Prisma.Decimal;
            isVeg: boolean;
            categoryId: string;
            isBestseller: boolean;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    })[]>;
    createCategory(userId: string, dto: CreateCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    updateCategory(userId: string, id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    deleteCategory(userId: string, id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    reorderCategory(userId: string, id: string, dto: ReorderCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    getItems(categoryId: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: Prisma.Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }[]>;
    createItem(userId: string, dto: CreateMenuItemDto): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: Prisma.Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    updateItem(userId: string, id: string, dto: UpdateMenuItemDto): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: Prisma.Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    deleteItem(userId: string, id: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: Prisma.Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    toggleAvailability(userId: string, id: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: Prisma.Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    getUploadUrl(userId: string, itemId: string): Promise<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
    }>;
    addImage(userId: string, itemId: string, imageUrl: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: Prisma.Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    getModifiers(itemId: string): Promise<{
        name: string;
        id: string;
        options: Prisma.JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }[]>;
    createModifier(userId: string, dto: CreateModifierDto): Promise<{
        name: string;
        id: string;
        options: Prisma.JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }>;
    updateModifier(userId: string, id: string, dto: UpdateModifierDto): Promise<{
        name: string;
        id: string;
        options: Prisma.JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }>;
    deleteModifier(userId: string, id: string): Promise<{
        name: string;
        id: string;
        options: Prisma.JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }>;
}
