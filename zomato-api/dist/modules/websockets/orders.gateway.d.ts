import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(orderId: string, client: Socket): unknown;
    handleLeaveRoom(orderId: string, client: Socket): unknown;
    emitOrderStatusUpdate(orderId: string, status: string, data?: any): void;
    emitOrderAssigned(orderId: string, partnerId: string): void;
}
