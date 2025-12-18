import { UsersService } from './users.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        name: string;
        email: string | null;
        id: string;
        phone: string;
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
        name: string;
        email: string | null;
        id: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isActive: boolean;
        isVerified: boolean;
        passwordHash: string | null;
        createdAt: Date;
        updatedAt: Date;
        fcmTokens: string[];
    }>;
    getAvatarUploadUrl(req: any): Promise<void>;
    updateAvatar(req: any, avatarUrl: string): Promise<{
        name: string;
        email: string | null;
        id: string;
        phone: string;
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
        label: string;
        fullAddress: string;
        landmark: string | null;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        userId: string;
        isDefault: boolean;
    }[]>;
    createAddress(req: any, dto: CreateAddressDto): Promise<{
        label: string;
        fullAddress: string;
        landmark: string | null;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        userId: string;
        isDefault: boolean;
    }>;
    updateAddress(req: any, id: string, dto: UpdateAddressDto): Promise<{
        label: string;
        fullAddress: string;
        landmark: string | null;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        userId: string;
        isDefault: boolean;
    }>;
    deleteAddress(req: any, id: string): Promise<{
        label: string;
        fullAddress: string;
        landmark: string | null;
        location: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        userId: string;
        isDefault: boolean;
    }>;
    setDefaultAddress(req: any, id: string): Promise<{
        message: string;
    }>;
    deactivateAccount(req: any): Promise<{
        name: string;
        email: string | null;
        id: string;
        phone: string;
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
