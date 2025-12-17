import { UserRole } from '@prisma/client';
export declare class SendOtpDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
}
export declare class SignupDto {
    phone: string;
    name: string;
    email?: string;
    role: UserRole;
    password?: string;
}
export declare class LoginDto {
    phone: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
