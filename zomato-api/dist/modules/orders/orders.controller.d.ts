import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto, AssignDeliveryPartnerDto } from './dto/order-status.dto';
import { OrderFilterDto, CreateRatingDto } from './dto/customer-order.dto';
export declare class OrdersController {
    private ordersService;
    private orderStateService;
    constructor(ordersService: OrdersService, orderStateService: OrderStateService);
    create(req: any, dto: CreateOrderDto): unknown;
    listOrders(req: any, filters: OrderFilterDto): unknown;
    getActiveOrder(req: any): unknown;
    getOrder(req: any, id: string): unknown;
    rateOrder(req: any, id: string, dto: CreateRatingDto): unknown;
    acceptOrder(req: any, id: string): unknown;
    prepareOrder(req: any, id: string): unknown;
    readyOrder(req: any, id: string): unknown;
    assignOrder(id: string, dto: AssignDeliveryPartnerDto): unknown;
    claimOrder(req: any, id: string): unknown;
    pickupOrder(req: any, id: string): unknown;
    deliverOrder(req: any, id: string): unknown;
    findAvailableForDelivery(req: any, lat: string, lng: string): unknown;
    cancelOrder(req: any, id: string, dto: CancelOrderDto): unknown;
}
