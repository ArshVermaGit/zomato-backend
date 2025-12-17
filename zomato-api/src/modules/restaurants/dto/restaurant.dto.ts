import { IsString, IsOptional, IsNotEmpty, IsNumber, IsBoolean, IsArray, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateRestaurantDto {
    @ApiProperty({ example: 'Burger Singh' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Best burgers in town' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: ['Fast Food', 'Burgers'] })
    @IsArray()
    @IsString({ each: true })
    cuisineTypes: string[];

    @ApiProperty({ example: '9876543210' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({ example: 'contact@burgersingh.com' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ example: { lat: 28.6304, lng: 77.2177, address: 'Connaught Place' } })
    @IsNotEmpty()
    location: any; // Validated in service or custom validator

    @ApiProperty({ example: 30 })
    @IsNumber()
    preparationTime: number;

    @ApiProperty({ example: 50 })
    @IsNumber()
    deliveryFee: number;

    @ApiProperty({ example: 100, required: false })
    @IsOptional()
    @IsNumber()
    minimumOrder?: number;

    @ApiProperty({ example: 'partner-uuid-123' })
    @IsNotEmpty()
    @IsString()
    partnerId: string;
}

export class UpdateRestaurantDto {
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
    @IsArray()
    @IsString({ each: true })
    cuisineTypes?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isOpen?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class RestaurantFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    cuisine?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    vegOnly?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minRating?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxDeliveryFee?: number;

    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, default: 10 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    limit?: number = 10;
}

export class SearchRestaurantDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    query: string;
}

export class NearbyRestaurantDto {
    @ApiProperty({ example: 28.6304 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    lat: number;

    @ApiProperty({ example: 77.2177 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    lng: number;

    @ApiProperty({ example: 5, description: 'Radius in KM', required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    radius?: number = 5;
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
    @Type(() => Number)
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isVeg?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isBestseller?: boolean;
}
