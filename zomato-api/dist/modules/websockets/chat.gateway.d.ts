import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined;
    handleDisconnect(_client: Socket): void;
    handleJoinRoom(roomId: string, client: Socket): any;
    handleMessage(data: {
        roomId: string;
        message: string;
    }, _client: Socket): void;
    handleTypingStart(data: {
        roomId: string;
    }, _client: Socket): void;
    handleTypingStop(data: {
        roomId: string;
    }, _client: Socket): void;
}
