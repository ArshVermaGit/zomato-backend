import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Category DTOs
export class CreateCategoryDto {
    @ApiProperty({ example: 'Burgers' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Delicious juicy burgers', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'restaurant-uuid' })
    @IsNotEmpty()
    @IsUUID()
    restaurantId: string;
}

export class UpdateCategoryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class ReorderCategoryDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    newDisplayOrder: number;
}

// Menu Item DTOs
export class CreateMenuItemDto {
    @ApiProperty({ example: 'Classic Cheese Burger' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'With cheddar and pickles' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 199 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: false })
    @IsNotEmpty()
    @IsBoolean()
    isVeg: boolean;

    @ApiProperty({ example: 'category-uuid' })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}

export class UpdateMenuItemDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isVeg?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}

// Modifier DTOs
class ModifierOptionDto {
    @ApiProperty({ example: 'Extra Cheese' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 50 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class CreateModifierDto {
    @ApiProperty({ example: 'Add-ons' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ type: [ModifierOptionDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModifierOptionDto)
    options: ModifierOptionDto[];

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;

    @ApiProperty({ example: 'menu-item-uuid' })
    @IsNotEmpty()
    @IsUUID()
    menuItemId: string;
}

export class UpdateModifierDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ type: [ModifierOptionDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModifierOptionDto)
    options?: ModifierOptionDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isRequired?: boolean;
}
