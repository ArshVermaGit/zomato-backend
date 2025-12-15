import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, SignupDto, RefreshTokenDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
        otp: string | undefined;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string | null;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
            avatar: string | null;
            razorpayCustomerId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            fcmTokens: string[];
            notificationPreferences: import("@prisma/client/runtime/client").JsonValue | null;
        };
    }>;
    login(req: any, loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string | null;
            id: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
            password: string | null;
            avatar: string | null;
            razorpayCustomerId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            fcmTokens: string[];
            notificationPreferences: import("@prisma/client/runtime/client").JsonValue | null;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
