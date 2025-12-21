import { PrismaService } from '../../database/prisma.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto, CreateRatingDto } from './dto/customer-order.dto';
import { PromosService } from '../promos/promos.service';
import { EarningsService } from '../delivery/earnings.service';
export declare class OrdersService {
    private prisma;
    private realtimeGateway;
    private notificationsService;
    private paymentsService;
    private promosService;
    private earningsService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, notificationsService: NotificationsService, paymentsService: PaymentsService, promosService: PromosService, earningsService: EarningsService);
    createOrder(customerId: string, dto: CreateOrderDto): Promise<any>;
    acceptOrder(orderId: string, restaurantUserId: string, estimatedPrepTime: number): Promise<any>;
    markOrderReady(orderId: string, restaurantUserId: string): Promise<any>;
    assignDeliveryPartner(orderId: string, deliveryUserId: string): Promise<any>;
    updateDeliveryLocation(orderId: string, deliveryPartnerId: string, location: {
        lat: number;
        lng: number;
        heading: number;
    }): Promise<{
        success: boolean;
    }>;
    markOrderDelivered(orderId: string, deliveryUserId: string, deliveryOTP: string): Promise<any>;
    findAll(customerId: string, filters: OrderFilterDto): Promise<any>;
    findActive(customerId: string): Promise<any>;
    findOne(customerId: string, orderId: string): Promise<any>;
    rateOrder(customerId: string, orderId: string, dto: CreateRatingDto): Promise<any>;
    findAvailableForDelivery(lat: number, lng: number): Promise<any>;
    findNearbyDeliveryPartners(location: any, radiusKm: number): Promise<any>;
}
