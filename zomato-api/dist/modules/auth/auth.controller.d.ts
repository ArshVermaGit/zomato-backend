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
        user: User;
    }>;
    login(req: any, _loginDto: LoginDto): {
        accessToken: string;
        refreshToken: string;
        user: User;
    };
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(_req: any): {
        message: string;
    };
}
