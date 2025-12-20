import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'menu-item-uuid' })
  @IsNotEmpty()
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: ['modifier-uuid-1', 'modifier-uuid-2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modifiers?: string[];

  @ApiProperty({ example: 'No onions please', required: false })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'restaurant-uuid' })
  @IsNotEmpty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'address-uuid' })
  @IsNotEmpty()
  @IsUUID()
  deliveryAddressId: string;

  @ApiProperty({ example: 'UPI', enum: ['UPI', 'CARD', 'COD'] }) // Simple enum for now
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'WELCOME50', required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tip?: number;

  @ApiProperty({ example: 'Leave at door', required: false })
  @IsOptional()
  @IsString()
  customerInstructions?: string;
}
