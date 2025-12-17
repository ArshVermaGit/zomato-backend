import { PrismaService } from '../../database/prisma.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto, CreateRatingDto } from './dto/customer-order.dto';
export declare class OrdersService {
    private prisma;
    private realtimeGateway;
    private notificationsService;
    private paymentsService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, notificationsService: NotificationsService, paymentsService: PaymentsService);
    createOrder(customerId: string, dto: CreateOrderDto): unknown;
    acceptOrder(orderId: string, restaurantPartnerId: string, estimatedPrepTime: number): unknown;
    markOrderReady(orderId: string, restaurantPartnerId: string): unknown;
    assignDeliveryPartner(orderId: string, deliveryPartnerId: string): unknown;
    updateDeliveryLocation(orderId: string, deliveryPartnerId: string, location: {
        lat: number;
        lng: number;
        heading: number;
    }): unknown;
    markOrderDelivered(orderId: string, deliveryPartnerId: string, deliveryOTP: string): unknown;
    findAll(customerId: string, filters: OrderFilterDto): unknown;
    findActive(customerId: string): unknown;
    findOne(customerId: string, orderId: string): unknown;
    rateOrder(customerId: string, orderId: string, dto: CreateRatingDto): unknown;
    findAvailableForDelivery(lat: number, lng: number): unknown;
    findNearbyDeliveryPartners(location: any, radiusKm: number): unknown;
    validatePromo(code: string, orderAmount: number): unknown;
}
