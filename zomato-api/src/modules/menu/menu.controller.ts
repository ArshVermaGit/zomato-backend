import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateModifierDto,
  UpdateModifierDto,
} from './dto/menu.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  // PUBLIC ROUTES (Anyone can view menu)
  @Get('categories/:restaurantId')
  @ApiOperation({ summary: 'Get menu categories for a restaurant' })
  async getCategories(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ) {
    return this.menuService.getCategories(restaurantId);
  }

  @Get('items/:categoryId')
  @ApiOperation({ summary: 'Get items in a category' })
  async getItems(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.menuService.getItems(categoryId);
  }

  @Get('modifiers/:itemId')
  @ApiOperation({ summary: 'Get modifiers for an item' })
  async getModifiers(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.menuService.getModifiers(itemId);
  }

  // PARTNER ROUTES (Protected)

  // Categories
  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Request() req, @Body() dto: CreateCategoryDto) {
    if (req.user.role === UserRole.ADMIN) {
      // Admin can do anything? Or use override?
      // Service checks ownership via partner table. Admin doesn't have partner record usually.
      // For simple MVP logic, assuming Partner creates menu.
      // Admin feature would require bypassing checkOwnership.
      // Stick to Partner flow for now as per requirements.
    }
    return this.menuService.createCategory(req.user.userId, dto);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(req.user.userId, id, dto);
  }

  @Put('categories/:id/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder category' })
  async reorderCategory(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReorderCategoryDto,
  ) {
    return this.menuService.reorderCategory(req.user.userId, id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.deleteCategory(req.user.userId, id);
  }

  // Items
  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu item' })
  async createItem(@Request() req, @Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(req.user.userId, dto);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update menu item' })
  async updateItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateItem(req.user.userId, id, dto);
  }

  @Put('items/:id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle item availability' })
  async toggleAvailability(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.menuService.toggleAvailability(req.user.userId, id);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete menu item' })
  async deleteItem(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.deleteItem(req.user.userId, id);
  }

  @Put('items/:id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add uploaded image URL to item' })
  async addImage(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.menuService.addImage(req.user.userId, id, imageUrl);
  }

  // Modifiers
  @Post('modifiers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create modifier' })
  async createModifier(@Request() req, @Body() dto: CreateModifierDto) {
    return this.menuService.createModifier(req.user.userId, dto);
  }

  @Put('modifiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update modifier' })
  async updateModifier(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateModifierDto,
  ) {
    return this.menuService.updateModifier(req.user.userId, id, dto);
  }

  @Delete('modifiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete modifier' })
  async deleteModifier(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.deleteModifier(req.user.userId, id);
  }
}
