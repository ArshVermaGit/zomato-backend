import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, SignupDto, RefreshTokenDto, LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(ThrottlerGuard)
    @Post('send-otp')
    @ApiOperation({ summary: 'Send OTP to phone number' })
    async sendOtp(@Body() dto: SendOtpDto) {
        return this.authService.sendOtp(dto);
    }

    @UseGuards(ThrottlerGuard)
    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP' })
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    async signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login with phone and password' })
    @ApiResponse({ status: 200, description: 'Return access and refresh tokens' })
    async login(@Request() req, @Body() loginDto: LoginDto) { // Body added for Swagger documentation
        return this.authService.login(req.user);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    async logout(@Request() req) {
        // In a stateless JWT system, logout is usually client-side (delete token).
        // Optionally, we could blacklist the token in Redis here.
        return { message: 'Logged out successfully' };
    }
}
