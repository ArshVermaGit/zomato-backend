import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, SignupDto, RefreshTokenDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): {
        message: string;
        otp: string | undefined;
    };
    verifyOtp(dto: VerifyOtpDto): {
        message: string;
    };
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            id: string;
            phone: string;
            email: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isActive: boolean;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            fcmTokens: string[];
        };
    }>;
    login(req: any, _loginDto: LoginDto): {
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            id: string;
            phone: string;
            email: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isActive: boolean;
            isVerified: boolean;
            passwordHash: string | null;
            createdAt: Date;
            updatedAt: Date;
            fcmTokens: string[];
        };
    };
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(_req: any): {
        message: string;
    };
}
