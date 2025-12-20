import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Arsh Verma', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'arsh@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateAddressDto {
  @ApiProperty({ example: 'Home' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({ example: 'Connaught Place, New Delhi' })
  @IsNotEmpty()
  @IsString()
  fullAddress: string;

  @ApiProperty({ example: 'Near Metro Station', required: false })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({
    example: { lat: 28.6304, lng: 77.2177 },
    required: false,
    description: 'Will be auto-filled if not provided',
  })
  @IsOptional()
  location?: any; // We'll validate structure in service or custom validator if needed

  // Actually, better to validate lat/lng if provided
  @ApiProperty({ example: 28.6304, required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ example: 77.2177, required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;
}

export class UpdateAddressDto {
  @ApiProperty({ example: 'Home', required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 'Connaught Place, New Delhi', required: false })
  @IsOptional()
  @IsString()
  fullAddress?: string;

  @ApiProperty({ example: 'Near Metro Station', required: false })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({ example: 28.6304, required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ example: 77.2177, required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;
}
