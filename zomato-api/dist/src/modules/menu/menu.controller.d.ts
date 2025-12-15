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
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
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
    }[]>;
    getModifiers(itemId: string): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
    }[]>;
    createCategory(req: any, dto: CreateCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        restaurantId: string;
        displayOrder: number;
    }>;
    updateCategory(req: any, id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        restaurantId: string;
        displayOrder: number;
    }>;
    reorderCategory(req: any, id: string, dto: ReorderCategoryDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        restaurantId: string;
        displayOrder: number;
    }>;
    deleteCategory(req: any, id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
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
    }>;
    createModifier(req: any, dto: CreateModifierDto): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
    }>;
    updateModifier(req: any, id: string, dto: UpdateModifierDto): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
    }>;
    deleteModifier(req: any, id: string): Promise<{
        name: string;
        id: string;
        options: import("@prisma/client/runtime/client").JsonValue[];
        isRequired: boolean;
        menuItemId: string;
    }>;
}
