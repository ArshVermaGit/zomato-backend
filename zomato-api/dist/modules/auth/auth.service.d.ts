import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SendOtpDto } from './dto/auth.dto';
import { VerifyOtpDto } from './dto/auth.dto';
import { SignupDto } from './dto/auth.dto';
import { User } from '@prisma/client';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private otpStore;
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
        otp: string | undefined;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    validateUser(phone: string, pass: string): Promise<any>;
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string | null;
            id: string;
            phone: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isActive: boolean;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            fcmTokens: string[];
        };
    }>;
    login(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string | null;
            id: string;
            phone: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isActive: boolean;
            isVerified: boolean;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
            fcmTokens: string[];
        };
    }>;
    generateTokens(user: Partial<User>): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
