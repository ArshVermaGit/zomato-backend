export declare class LoginDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
}
export declare class SignupDto {
    name: string;
    email: string;
    phone: string;
}
export declare class CreateOrderDto {
    restaurantId: string;
    addressId: string;
    items: {
        menuItemId: string;
        quantity: number;
    }[];
    instructions?: string;
}
export declare class AddressDto {
    address: string;
    latitude: number;
    longitude: number;
    landmark?: string;
}
