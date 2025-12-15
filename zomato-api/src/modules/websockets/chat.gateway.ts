import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsAuthMiddleware } from './ws-auth.middleware';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    handleConnection(client: Socket) {
        const auth = new WsAuthMiddleware(this.jwtService, this.configService);
        const user = auth.validate(client);
        if (!user) return client.disconnect();
        client.data.user = user;
    }

    handleDisconnect(client: Socket) { }

    @SubscribeMessage('join_chat_room')
    handleJoinRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
        // Room ID could be orderId
        client.join(roomId);
    }

    @SubscribeMessage('message.send')
    handleMessage(@MessageBody() data: { roomId: string, message: string }, @ConnectedSocket() client: Socket) {
        this.server.to(data.roomId).emit('message.received', {
            senderId: client.data.user.userId,
            message: data.message,
            timestamp: new Date()
        });
    }

    @SubscribeMessage('typing.start')
    handleTypingStart(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
        client.to(data.roomId).emit('typing.start', { userId: client.data.user.userId });
    }

    @SubscribeMessage('typing.stop')
    handleTypingStop(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
        client.to(data.roomId).emit('typing.stop', { userId: client.data.user.userId });
    }
}
