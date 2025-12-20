import { UsersService } from './users.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    getAvatarUploadUrl(req: any): void;
    updateAvatar(req: any, avatarUrl: string): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    getAddresses(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        fullAddress: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        landmark: string | null;
        isDefault: boolean;
    }[]>;
    createAddress(req: any, dto: CreateAddressDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        fullAddress: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        landmark: string | null;
        isDefault: boolean;
    }>;
    updateAddress(req: any, id: string, dto: UpdateAddressDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        fullAddress: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        landmark: string | null;
        isDefault: boolean;
    }>;
    deleteAddress(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        fullAddress: string;
        location: import("@prisma/client/runtime/library").JsonValue;
        landmark: string | null;
        isDefault: boolean;
    }>;
    setDefaultAddress(req: any, id: string): Promise<{
        message: string;
    }>;
    deactivateAccount(req: any): Promise<{
        id: string;
        phone: string;
        email: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
}
