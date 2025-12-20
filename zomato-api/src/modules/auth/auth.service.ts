import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SendOtpDto } from './dto/auth.dto';
import { VerifyOtpDto } from './dto/auth.dto';
import { SignupDto } from './dto/auth.dto';
import { User } from '@prisma/client';
// import { RedisService } from '@liaoliaots/nestjs-redis';
// import Redis from 'ioredis';

@Injectable()
export class AuthService {
  // private readonly redis: Redis;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private redisService: RedisService,
    // Inject Redis service properly later if using liaoliaots/nestjs-redis
  ) {
    // this.redis = this.redisService.getClient();
  }

  // TODO: Add Redis for OTP
  private otpStore = new Map<string, string>(); // Temporary in-memory store

  sendOtp(dto: SendOtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // await this.redis.set(`otp:${dto.phone}`, otp, 'EX', 300); // 5 mins
    this.otpStore.set(dto.phone, otp);
    console.log(`OTP for ${dto.phone}: ${otp}`); // For Dev
    return {
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  verifyOtp(dto: VerifyOtpDto) {
    // const storedOtp = await this.redis.get(`otp:${dto.phone}`);
    const storedOtp = this.otpStore.get(dto.phone);

    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    // await this.redis.del(`otp:${dto.phone}`);
    this.otpStore.delete(dto.phone);
    return { message: 'OTP verified successfully' };
  }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByPhone(phone);
    if (!user) return null;

    // Check if user has a password and if it matches
    if (user.passwordHash && (await bcrypt.compare(pass, user.passwordHash))) {
      // Exclude password from result
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findOneByPhone(dto.phone);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    let hashedPassword = undefined;
    if (dto.password) {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.usersService.create({
      phone: dto.phone,
      name: dto.name,
      email: dto.email,
      role: dto.role,
      passwordHash: hashedPassword,
      isActive: true,
    });

    const tokens = this.generateTokens(user);
    const { passwordHash: _passwordHash, ...result } = user;
    return { user: result, ...tokens };
  }

  login(user: User) {
    const tokens = this.generateTokens(user);
    // User already validated by LocalStrategy, just return tokens + user info
    // Clean user object if it has sensitive data, but usually LocalStrategy returns clean user
    return { user, ...tokens };
  }

  generateTokens(user: Partial<User>) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch (_e) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }
}
