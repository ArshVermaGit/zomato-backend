import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class DeliveryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): void;
    handleDisconnect(_client: Socket): void;
    handleLocationUpdate(data: {
        lat: number;
        lng: number;
        orderId?: string;
    }, _client: Socket): void;
    handleJoinRoom(orderId: string, client: Socket): any;
}
