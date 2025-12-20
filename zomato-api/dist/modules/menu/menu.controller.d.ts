import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
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
    getModifiers(itemId: string): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }[]>;
    createCategory(req: any, dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    updateCategory(req: any, id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    reorderCategory(req: any, id: string, dto: ReorderCategoryDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    deleteCategory(req: any, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        restaurantId: string;
        isActive: boolean;
    }>;
    createItem(req: any, dto: CreateMenuItemDto): Promise<{
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
    updateItem(req: any, id: string, dto: UpdateMenuItemDto): Promise<{
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
    toggleAvailability(req: any, id: string): Promise<{
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
    deleteItem(req: any, id: string): Promise<{
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
    addImage(req: any, id: string, imageUrl: string): Promise<{
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
    createModifier(req: any, dto: CreateModifierDto): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }>;
    updateModifier(req: any, id: string, dto: UpdateModifierDto): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }>;
    deleteModifier(req: any, id: string): Promise<{
        id: string;
        name: string;
        options: import("@prisma/client/runtime/library").JsonValue[];
        isRequired: boolean;
        minSelect: number;
        maxSelect: number;
        menuItemId: string;
    }>;
}
