import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class WsAuthMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  validate(client: Socket) {
    // Token passed in handshake query or headers
    const token =
      (client.handshake.query.token as string) ||
      client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return null;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return payload; // { userId, email, role }
    } catch (_err) {
      return null;
    }
  }
}
