import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto, AssignDeliveryPartnerDto } from './dto/order-status.dto';
import { OrderFilterDto, CreateRatingDto } from './dto/customer-order.dto';
export declare class OrdersController {
    private ordersService;
    private orderStateService;
    constructor(ordersService: OrdersService, orderStateService: OrderStateService);
    create(req: any, dto: CreateOrderDto): Promise<any>;
    listOrders(req: any, filters: OrderFilterDto): Promise<any>;
    getActiveOrder(req: any): Promise<any>;
    getOrder(req: any, id: string): Promise<any>;
    rateOrder(req: any, id: string, dto: CreateRatingDto): Promise<any>;
    acceptOrder(id: string, req: any, dto: {
        estimatedPrepTime: number;
    }): Promise<any>;
    prepareOrder(req: any, id: string): Promise<any>;
    readyOrder(req: any, id: string): Promise<any>;
    assignOrder(id: string, dto: AssignDeliveryPartnerDto): Promise<any>;
    claimOrder(req: any, id: string): Promise<any>;
    pickupOrder(req: any, id: string): Promise<any>;
    deliverOrder(req: any, id: string, dto: {
        deliveryOTP: string;
    }): Promise<any>;
    findAvailableForDelivery(req: any, lat: string, lng: string): Promise<any>;
    cancelOrder(req: any, id: string, dto: CancelOrderDto): Promise<any>;
}
