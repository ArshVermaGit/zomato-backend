import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private connectedUsers;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    emitToCustomer(userId: string, event: string, data: any): void;
    emitToRestaurant(restaurantId: string, event: string, data: any): void;
    emitToDeliveryPartner(partnerId: string, event: string, data: any): void;
    emitToAvailableDeliveryPartners(location: {
        lat: number;
        lng: number;
    }, event: string, data: any): void;
    emitToAdmins(event: string, data: any): void;
    notifyNewOrder(order: any): void;
    notifyOrderAccepted(order: any): void;
    notifyOrderReady(order: any): void;
    notifyDeliveryPartnerAssigned(order: any): void;
    notifyLocationUpdate(orderId: string, customerId: string, location: any): void;
    notifyOrderDelivered(order: any): void;
    notifyRestaurantStatusChanged(restaurantId: string, isOpen: boolean): void;
    notifyMenuUpdated(restaurantId: string): void;
    handleMessage(client: Socket, data: {
        orderId: string;
        message: string;
        recipientId: string;
    }): void;
}
