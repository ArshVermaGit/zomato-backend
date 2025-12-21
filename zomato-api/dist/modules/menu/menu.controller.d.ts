import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateModifierDto, UpdateModifierDto } from './dto/menu.dto';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    getCategories(restaurantId: string): Promise<any>;
    getItems(categoryId: string): Promise<any>;
    getModifiers(itemId: string): Promise<any>;
    createCategory(req: any, dto: CreateCategoryDto): Promise<any>;
    updateCategory(req: any, id: string, dto: UpdateCategoryDto): Promise<any>;
    reorderCategory(req: any, id: string, dto: ReorderCategoryDto): Promise<any>;
    deleteCategory(req: any, id: string): Promise<any>;
    createItem(req: any, dto: CreateMenuItemDto): Promise<any>;
    updateItem(req: any, id: string, dto: UpdateMenuItemDto): Promise<any>;
    toggleAvailability(req: any, id: string): Promise<any>;
    deleteItem(req: any, id: string): Promise<any>;
    addImage(req: any, id: string, imageUrl: string): Promise<any>;
    createModifier(req: any, dto: CreateModifierDto): Promise<any>;
    updateModifier(req: any, id: string, dto: UpdateModifierDto): Promise<any>;
    deleteModifier(req: any, id: string): Promise<any>;
}
