import { Module, Global } from '@nestjs/common';
import { OrdersGateway } from './orders.gateway';
import { DeliveryGateway } from './delivery.gateway';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        AuthModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    providers: [OrdersGateway, DeliveryGateway, ChatGateway],
    exports: [OrdersGateway, DeliveryGateway, ChatGateway],
})
export class WebsocketsModule { }
