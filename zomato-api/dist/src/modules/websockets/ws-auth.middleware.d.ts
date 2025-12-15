import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class WsAuthMiddleware {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    validate(client: Socket): any;
}
