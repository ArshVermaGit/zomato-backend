import { Server, Socket } from 'socket.io';
import { LocationService } from './location.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class LocationGateway {
    private readonly locationService;
    private jwtService;
    private configService;
    server: Server;
    constructor(locationService: LocationService, jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined;
    handleLocationUpdate(data: {
        lat: number;
        lng: number;
        orderId?: string;
    }, client: Socket): Promise<void>;
    handleTrackOrder(orderId: string, client: Socket): void;
}
