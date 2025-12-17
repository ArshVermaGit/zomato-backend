import { UsersService } from './users.service';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): unknown;
    updateProfile(req: any, dto: UpdateProfileDto): unknown;
    getAvatarUploadUrl(req: any): unknown;
    updateAvatar(req: any, avatarUrl: string): unknown;
    getAddresses(req: any): unknown;
    createAddress(req: any, dto: CreateAddressDto): unknown;
    updateAddress(req: any, id: string, dto: UpdateAddressDto): unknown;
    deleteAddress(req: any, id: string): unknown;
    setDefaultAddress(req: any, id: string): unknown;
    deactivateAccount(req: any): unknown;
}
