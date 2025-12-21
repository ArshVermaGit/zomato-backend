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
    sendOtp(dto: SendOtpDto): {
        message: string;
        otp: string | undefined;
    };
    verifyOtp(dto: VerifyOtpDto): {
        message: string;
    };
    validateUser(phone: string, pass: string): Promise<any>;
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    login(user: User): {
        accessToken: string;
        refreshToken: string;
        user: User;
    };
    generateTokens(user: Partial<User>): {
        accessToken: string;
        refreshToken: string;
    };
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
