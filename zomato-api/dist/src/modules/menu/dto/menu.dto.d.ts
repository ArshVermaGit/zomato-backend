export declare class CreateCategoryDto {
    name: string;
    description?: string;
    restaurantId: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
}
export declare class ReorderCategoryDto {
    newDisplayOrder: number;
}
export declare class CreateMenuItemDto {
    name: string;
    description: string;
    price: number;
    isVeg: boolean;
    categoryId: string;
}
export declare class UpdateMenuItemDto {
    name?: string;
    description?: string;
    price?: number;
    isVeg?: boolean;
    isAvailable?: boolean;
}
declare class ModifierOptionDto {
    name: string;
    price: number;
    isDefault?: boolean;
}
export declare class CreateModifierDto {
    name: string;
    options: ModifierOptionDto[];
    isRequired?: boolean;
    menuItemId: string;
}
export declare class UpdateModifierDto {
    name?: string;
    options?: ModifierOptionDto[];
    isRequired?: boolean;
}
export {};
