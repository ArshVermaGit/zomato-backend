import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    getCategories(restaurantId: string): unknown;
    getItems(categoryId: string): unknown;
    getModifiers(itemId: string): unknown;
    createCategory(req: any, dto: CreateCategoryDto): unknown;
    updateCategory(req: any, id: string, dto: UpdateCategoryDto): unknown;
    reorderCategory(req: any, id: string, dto: ReorderCategoryDto): unknown;
    deleteCategory(req: any, id: string): unknown;
    createItem(req: any, dto: CreateMenuItemDto): unknown;
    updateItem(req: any, id: string, dto: UpdateMenuItemDto): unknown;
    toggleAvailability(req: any, id: string): unknown;
    deleteItem(req: any, id: string): unknown;
    getUploadUrl(req: any, id: string): unknown;
    addImage(req: any, id: string, imageUrl: string): unknown;
    createModifier(req: any, dto: CreateModifierDto): unknown;
    updateModifier(req: any, id: string, dto: UpdateModifierDto): unknown;
    deleteModifier(req: any, id: string): unknown;
}
