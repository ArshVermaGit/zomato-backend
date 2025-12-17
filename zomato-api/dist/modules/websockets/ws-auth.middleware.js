"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAuthMiddleware = void 0;
class WsAuthMiddleware {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    validate(client) {
        const token = client.handshake.query.token || client.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return null;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET')
            });
            return payload;
        }
        catch (err) {
            return null;
        }
    }
}
exports.WsAuthMiddleware = WsAuthMiddleware;
//# sourceMappingURL=ws-auth.middleware.js.map