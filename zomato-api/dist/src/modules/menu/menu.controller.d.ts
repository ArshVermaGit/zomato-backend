import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    getCategories(restaurantId: string): Promise<({
        items: {
            name: string;
            description: string;
            id: string;
            isAvailable: boolean;
            images: string[];
            price: import("@prisma/client-runtime-utils").Decimal;
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
    getItems(categoryId: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: import("@prisma/client-runtime-utils").Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }[]>;
    getModifiers(itemId: string): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }[]>;
    createCategory(req: any, dto: CreateCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    updateCategory(req: any, id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    reorderCategory(req: any, id: string, dto: ReorderCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    deleteCategory(req: any, id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        restaurantId: string;
        displayOrder: number;
    }>;
    createItem(req: any, dto: CreateMenuItemDto): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: import("@prisma/client-runtime-utils").Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    updateItem(req: any, id: string, dto: UpdateMenuItemDto): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: import("@prisma/client-runtime-utils").Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    toggleAvailability(req: any, id: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: import("@prisma/client-runtime-utils").Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    deleteItem(req: any, id: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: import("@prisma/client-runtime-utils").Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    getUploadUrl(req: any, id: string): Promise<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
    }>;
    addImage(req: any, id: string, imageUrl: string): Promise<{
        name: string;
        description: string;
        id: string;
        isAvailable: boolean;
        images: string[];
        price: import("@prisma/client-runtime-utils").Decimal;
        isVeg: boolean;
        categoryId: string;
        isBestseller: boolean;
    }>;
    createModifier(req: any, dto: CreateModifierDto): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }>;
    updateModifier(req: any, id: string, dto: UpdateModifierDto): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }>;
    deleteModifier(req: any, id: string): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
        minSelect: number;
        maxSelect: number;
    }>;
}
