import { PrismaService } from '../../database/prisma.service';
import { OrderStatus, UserRole } from '@prisma/client';
export declare class OrderStateService {
    private prisma;
    constructor(prisma: PrismaService);
    transition(orderId: string, toStatus: OrderStatus, userId: string, role: UserRole, reason?: string, deliveryPartnerId?: string): Promise<any>;
    assignPartner(orderId: string, deliveryPartnerId: string): Promise<any>;
    private authorizeTransition;
    private validateTransition;
}
