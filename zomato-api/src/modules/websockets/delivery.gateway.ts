import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsAuthMiddleware } from './ws-auth.middleware';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'delivery'
})
export class DeliveryGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

    @SubscribeMessage('update_location')
    handleLocationUpdate(@MessageBody() data: { lat: number; lng: number, orderId?: string }, @ConnectedSocket() client: Socket) {
        // Broadcast to relevant order room if orderId present, or just log
        if (data.orderId) {
            // Emitting to 'orders' namespace from here is tricky directly. 
            // usually you'd iterate or use a shared Redis adapter.
            // For MVP, we presume client joins a 'tracking_{orderId}' room in THIS namespace too.
            this.server.to(`tracking_${data.orderId}`).emit('delivery.location_update', {
                partnerId: client.data.user.userId,
                lat: data.lat,
                lng: data.lng
            });
        }
    }

    @SubscribeMessage('join_delivery_room')
    handleJoinRoom(@MessageBody('orderId') orderId: string, @ConnectedSocket() client: Socket) {
        client.join(`tracking_${orderId}`);
    }
}
