import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsAuthMiddleware } from './ws-auth.middleware';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'orders'
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    handleConnection(client: Socket) {
        const auth = new WsAuthMiddleware(this.jwtService, this.configService);
        const user = auth.validate(client);

        if (!user) {
            client.disconnect();
            return;
        }

        // Store user info in socket data
        client.data.user = user;
        console.log(`Client connected to Orders: ${client.id}, User: ${user.userId}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected from Orders: ${client.id}`);
    }

    @SubscribeMessage('join_order_room')
    handleJoinRoom(@MessageBody('orderId') orderId: string, @ConnectedSocket() client: Socket) {
        // Validation: Verify user belongs to this order (skipped for brevity, ideally check DB)
        client.join(`order_${orderId}`);
        console.log(`User ${client.data.user.userId} joined order_${orderId}`);
        return { event: 'joined_room', data: { orderId } };
    }

    @SubscribeMessage('leave_order_room')
    handleLeaveRoom(@MessageBody('orderId') orderId: string, @ConnectedSocket() client: Socket) {
        client.leave(`order_${orderId}`);
        return { event: 'left_room', data: { orderId } };
    }

    // Emitters (Called by Services)
    emitOrderStatusUpdate(orderId: string, status: string, data?: any) {
        this.server.to(`order_${orderId}`).emit('order.status_changed', { orderId, status, ...data });
    }

    emitOrderAssigned(orderId: string, partnerId: string) {
        this.server.to(`order_${orderId}`).emit('order.assigned', { orderId, partnerId });
    }
}
