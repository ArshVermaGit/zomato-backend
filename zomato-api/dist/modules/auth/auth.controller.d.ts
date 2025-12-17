import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, SignupDto, RefreshTokenDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): unknown;
    verifyOtp(dto: VerifyOtpDto): unknown;
    signup(dto: SignupDto): unknown;
    login(req: any, loginDto: LoginDto): unknown;
    refresh(dto: RefreshTokenDto): unknown;
    logout(req: any): unknown;
}
