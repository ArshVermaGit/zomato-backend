import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { WsAuthMiddleware } from '../websockets/ws-auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'location'
})
export class LocationGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly locationService: LocationService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    handleConnection(client: Socket) {
        const auth = new WsAuthMiddleware(this.jwtService, this.configService);
        const user = auth.validate(client);
        if (!user) return client.disconnect();
        client.data.user = user;
    }

    @SubscribeMessage('updateLocation')
    async handleLocationUpdate(
        @MessageBody() data: { lat: number; lng: number, orderId?: string },
        @ConnectedSocket() client: Socket
    ) {
        const driverId = client.data.user.userId;
        await this.locationService.updateDriverLocation(driverId, data.lat, data.lng);

        if (data.orderId) {
            // Broadcast to customers tracking this order
            this.server.to(`order_${data.orderId}`).emit('driverLocationUpdate', {
                driverId,
                lat: data.lat,
                lng: data.lng,
                timestamp: Date.now()
            });
        }
    }

    @SubscribeMessage('trackOrder')
    handleTrackOrder(
        @MessageBody('orderId') orderId: string,
        @ConnectedSocket() client: Socket
    ) {
        client.join(`order_${orderId}`);
        console.log(`Client ${client.id} joined tracking for order ${orderId}`);
    }
}
