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
  namespace: 'delivery',
})
export class DeliveryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const auth = new WsAuthMiddleware(this.jwtService, this.configService);
    const user = auth.validate(client);

    if (!user) {
      client.disconnect();
      return;
    }

    // Store user info in socket data
    client.data.user = user;
    console.log(
      `Client connected to Delivery: ${client.id}, User: ${user.userId as string}`,
    );
  }

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('update_location')
  handleLocationUpdate(
    @MessageBody() data: { lat: number; lng: number; orderId?: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const user = _client.data.user as { userId: string };
    // Broadcast to relevant order room if orderId present, or just log
    if (data.orderId) {
      this.server
        .to(`tracking_${data.orderId}`)
        .emit('delivery.location_update', {
          partnerId: user.userId,
          lat: data.lat,
          lng: data.lng,
        });
    }
  }

  @SubscribeMessage('join_delivery_room')
  async handleJoinRoom(
    @MessageBody('orderId') orderId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`tracking_${orderId}`);
  }
}
