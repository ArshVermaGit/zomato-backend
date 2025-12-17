"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    otpStore = new Map();
    async sendOtp(dto) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(dto.phone, otp);
        console.log(`OTP for ${dto.phone}: ${otp}`);
        return { message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? otp : undefined };
    }
    async verifyOtp(dto) {
        const storedOtp = this.otpStore.get(dto.phone);
        if (!storedOtp || storedOtp !== dto.otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        this.otpStore.delete(dto.phone);
        return { message: 'OTP verified successfully' };
    }
    async validateUser(phone, pass) {
        const user = await this.usersService.findOneByPhone(phone);
        if (!user)
            return null;
        if (user.passwordHash && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async signup(dto) {
        const existingUser = await this.usersService.findOneByPhone(dto.phone);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
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
        const tokens = await this.generateTokens(user);
        const { passwordHash, ...result } = user;
        return { user: result, ...tokens };
    }
    async login(user) {
        const tokens = await this.generateTokens(user);
        return { user, ...tokens };
    }
    async generateTokens(user) {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersService.findOneById(payload.sub);
            if (!user)
                throw new common_1.UnauthorizedException();
            return this.generateTokens(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid Refresh Token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map