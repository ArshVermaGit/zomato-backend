import { IsString, IsEmail, Length, IsPhoneNumber, IsOptional, Matches, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Auth DTOs
export class LoginDto {
    @ApiProperty({ example: '+919876543210' })
    @IsString()
    @Matches(/^\+[1-9]\d{9,14}$/, { message: 'Invalid phone number format' })
    phone: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '+919876543210' })
    @IsString()
    @Matches(/^\+[1-9]\d{9,14}$/)
    phone: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @Length(6, 6, { message: 'OTP must be 6 digits' })
    @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
    otp: string;
}

export class SignupDto {
    @ApiProperty({ example: 'Arsh Verma' })
    @IsString()
    @Length(2, 50)
    @Transform(({ value }) => value?.trim())
    name: string;

    @ApiProperty({ example: 'arsh@example.com' })
    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty({ example: '+919876543210' })
    @IsString()
    @Matches(/^\+[1-9]\d{9,14}$/)
    phone: string;
}

// Order DTOs
export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    restaurantId: string;

    @ApiProperty()
    @IsString()
    addressId: string;

    @ApiProperty({ type: [Object] })
    items: { menuItemId: string; quantity: number }[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 500)
    instructions?: string;
}

// Address DTO
export class AddressDto {
    @ApiProperty()
    @IsString()
    @Length(5, 200)
    address: string;

    @ApiProperty()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number;

    @ApiProperty()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 100)
    landmark?: string;
}
