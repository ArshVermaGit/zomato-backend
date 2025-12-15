import { IsNotEmpty, IsPhoneNumber, IsString, IsOptional, IsEmail, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class SendOtpDto {
    @ApiProperty({ example: '+919876543210' })
    @IsNotEmpty()
    @IsPhoneNumber() // 'null' allows auto-detection of region from phone number if it has country code
    phone: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '+919876543210' })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    otp: string;
}

export class SignupDto {
    @ApiProperty({ example: '+919876543210' })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: 'Arsh Verma' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'arsh@example.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({ example: 'password123', required: false })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}

export class LoginDto {
    @ApiProperty({ example: '+919876543210' })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
