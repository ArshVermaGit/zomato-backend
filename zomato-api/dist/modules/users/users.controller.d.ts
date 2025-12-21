import { UsersService } from './users.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<any>;
    getAvatarUploadUrl(req: any): void;
    updateAvatar(req: any, avatarUrl: string): Promise<User>;
    getAddresses(req: any): Promise<Address[]>;
    createAddress(req: any, dto: CreateAddressDto): Promise<Address>;
    updateAddress(req: any, id: string, dto: UpdateAddressDto): Promise<Address>;
    deleteAddress(req: any, id: string): Promise<any>;
    setDefaultAddress(req: any, id: string): Promise<{
        message: string;
    }>;
    deactivateAccount(req: any): Promise<User>;
}
