import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsAuthMiddleware } from './ws-auth.middleware';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const auth = new WsAuthMiddleware(this.jwtService, this.configService);
    const user = auth.validate(client);
    if (!user) return client.disconnect();
    client.data.user = user;
    console.log(
      `Client connected to Chat: ${client.id}, User: ${user.userId as string}`,
    );
  }

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('join_chat_room')
  async handleJoinRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Room ID could be orderId
    await client.join(roomId);
  }

  @SubscribeMessage('message.send')
  handleMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const user = _client.data.user as { userId: string };
    this.server.to(data.roomId).emit('message.received', {
      senderId: user.userId,
      message: data.message,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('typing.start')
  handleTypingStart(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const user = _client.data.user as { userId: string };
    this.server.to(data.roomId).emit('typing.start', { userId: user.userId });
  }

  @SubscribeMessage('typing.stop')
  handleTypingStop(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const user = _client.data.user as { userId: string };
    this.server.to(data.roomId).emit('typing.stop', { userId: user.userId });
  }
}
