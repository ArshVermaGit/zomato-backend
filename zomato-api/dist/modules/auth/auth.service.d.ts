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
    sendOtp(dto: SendOtpDto): unknown;
    verifyOtp(dto: VerifyOtpDto): unknown;
    validateUser(phone: string, pass: string): Promise<any>;
    signup(dto: SignupDto): unknown;
    login(user: User): unknown;
    generateTokens(user: Partial<User>): unknown;
    refreshTokens(refreshToken: string): unknown;
}
