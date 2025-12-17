export declare class OrderItemDto {
    menuItemId: string;
    quantity: number;
    modifiers?: string[];
    instructions?: string;
}
export declare class CreateOrderDto {
    restaurantId: string;
    items: OrderItemDto[];
    deliveryAddressId: string;
    paymentMethod: string;
    promoCode?: string;
    tip?: number;
    customerInstructions?: string;
}
