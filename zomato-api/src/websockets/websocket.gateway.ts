import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

// Helper function for distance calculation (Haversine formula)
function calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    if (!loc1 || !loc2) return 0;
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(loc2.lat - loc1.lat);
    const dLon = deg2rad(loc2.lng - loc1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(loc1.lat)) * Math.cos(deg2rad(loc2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(2));
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
    namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, { socketId: string; userId: string; role: string }> = new Map();

    constructor(private jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = await this.jwtService.verifyAsync(token);

            this.connectedUsers.set(client.id, {
                socketId: client.id,
                userId: payload.sub,
                role: payload.role,
            });

            // Join user-specific room
            client.join(`user:${payload.sub}`);

            // Join role-specific room
            client.join(`role:${payload.role}`);

            console.log(`✅ User ${payload.sub} (${payload.role}) connected - Socket: ${client.id}`);

        } catch (error) {
            console.error('❌ WebSocket authentication failed:', error);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            console.log(`❌ User ${user.userId} (${user.role}) disconnected`);
            this.connectedUsers.delete(client.id);
        }
    }

    // ============= ORDER EVENTS =============

    // Emit to customer
    emitToCustomer(userId: string, event: string, data: any) {
        this.server.to(`user:${userId}`).emit(event, data);
    }

    // Emit to restaurant
    emitToRestaurant(restaurantId: string, event: string, data: any) {
        // Find all sockets for this restaurant's partner (Approximation: restaurantId usually maps to a partner or has its own room)
        // For now, assuming restaurantId is used as a room, or we emit to the partner.
        // Ideally, restaurant staff joins `restaurant:{id}` room.
        // Let's ensure restaurant staff joins this room in handleConnection if we had restaurantId in payload.
        // Since we don't know restaurantId from payload easily without DB lookup, we might rely on the client joining it explicitly.
        // But for this implementation, we'll try to emit to the room `restaurant:{restaurantId}`
        this.server.to(`restaurant:${restaurantId}`).emit(event, data);
    }

    // Emit to delivery partner
    emitToDeliveryPartner(partnerId: string, event: string, data: any) {
        this.server.to(`user:${partnerId}`).emit(event, data);
    }

    // Emit to all online delivery partners in a zone
    emitToAvailableDeliveryPartners(location: { lat: number; lng: number }, event: string, data: any) {
        // In a real app, we'd use Geospatial query to find partners in `user_locations` redis/db
        // For now, emit to all delivery partners (simplification)
        this.server.to('role:DELIVERY_PARTNER').emit(event, data);
    }

    // Emit to admin dashboard
    emitToAdmins(event: string, data: any) {
        this.server.to('role:ADMIN').emit(event, data);
    }

    // ============= SPECIFIC EVENT EMITTERS =============

    // New order placed - notify restaurant and admins
    notifyNewOrder(order: any) {
        // Notify restaurant
        this.emitToRestaurant(order.restaurantId, 'order:new', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            items: order.items,
            totalAmount: order.totalAmount,
            customerName: order.customer.name,
            placedAt: order.placedAt,
        });

        // Notify admins
        this.emitToAdmins('order:created', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            restaurant: order.restaurant.name,
            totalAmount: order.totalAmount,
        });
    }

    // Order accepted - notify customer
    notifyOrderAccepted(order: any) {
        this.emitToCustomer(order.customerId, 'order:accepted', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            estimatedTime: order.estimatedDeliveryTime,
            restaurant: order.restaurant.name,
        });
    }

    // Order ready - notify available delivery partners
    notifyOrderReady(order: any) {
        // Emit to delivery partners near the restaurant
        this.emitToAvailableDeliveryPartners(order.restaurant.location, 'order:available', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            restaurant: {
                name: order.restaurant.name,
                location: order.restaurant.location,
            },
            deliveryLocation: order.deliveryAddress,
            earnings: order.deliveryFee * 0.8, // 80% goes to delivery partner
            distance: calculateDistance(order.restaurant.location, order.deliveryAddress),
        });
    }

    // Delivery partner assigned - notify customer and restaurant
    notifyDeliveryPartnerAssigned(order: any) {
        // Notify customer
        this.emitToCustomer(order.customerId, 'order:delivery_partner_assigned', {
            orderId: order.id,
            deliveryPartner: {
                name: order.deliveryPartner.user.name,
                phone: order.deliveryPartner.user.phone,
                vehicleType: order.deliveryPartner.vehicleType,
                rating: order.deliveryPartner.rating,
            },
        });

        // Notify restaurant
        this.emitToRestaurant(order.restaurantId, 'order:delivery_partner_assigned', {
            orderId: order.id,
            deliveryPartner: order.deliveryPartner.user.name,
        });
    }

    // Location update - notify customer
    notifyLocationUpdate(orderId: string, customerId: string, location: any) {
        this.emitToCustomer(customerId, 'delivery:location_update', {
            orderId,
            location,
            timestamp: new Date(),
        });
    }

    // Order delivered - notify everyone
    notifyOrderDelivered(order: any) {
        // Notify customer
        this.emitToCustomer(order.customerId, 'order:delivered', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            deliveredAt: order.deliveredAt,
        });

        // Notify restaurant
        this.emitToRestaurant(order.restaurantId, 'order:completed', {
            orderId: order.id,
            orderNumber: order.orderNumber,
        });
    }

    // ============= RESTAURANT EVENTS =============

    // Restaurant status changed
    notifyRestaurantStatusChanged(restaurantId: string, isOpen: boolean) {
        this.emitToAdmins('restaurant:status_changed', {
            restaurantId,
            isOpen,
            timestamp: new Date(),
        });
    }

    // Menu item updated
    notifyMenuUpdated(restaurantId: string) {
        this.server.emit('menu:updated', {
            restaurantId,
            timestamp: new Date(),
        });
    }

    // ============= CHAT EVENTS =============

    @SubscribeMessage('message:send')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { orderId: string; message: string; recipientId: string },
    ) {
        this.emitToCustomer(data.recipientId, 'message:received', {
            orderId: data.orderId,
            message: data.message,
            senderId: this.connectedUsers.get(client.id)?.userId,
            timestamp: new Date(),
        });
    }
}
