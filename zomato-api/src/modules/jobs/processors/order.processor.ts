import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { PrismaService } from '../../../database/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { subMinutes, subHours } from 'date-fns';

@Processor('orders')
export class OrderJobsProcessor {
    private readonly logger = new Logger(OrderJobsProcessor.name);

    constructor(private prisma: PrismaService) { }

    @Process('autoCancelUnpaid')
    async handleAutoCancel(job: Job) {
        this.logger.debug('Checking for unpaid orders to auto-cancel...');
        const tenMinutesAgo = subMinutes(new Date(), 10);

        const unpaidOrders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                createdAt: { lt: tenMinutesAgo }
            }
        });

        for (const order of unpaidOrders) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    status: OrderStatus.CANCELLED,
                }
            });
            this.logger.log(`Auto-cancelled order ${order.orderNumber}`);
        }
    }

    @Process('monitorStuckOrders')
    async monitorStuckOrders(job: Job) {
        // Example: Check orders "OUT_FOR_DELIVERY" for > 2 hours
        const twoHoursAgo = subHours(new Date(), 2);
        const stuckOrders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.OUT_FOR_DELIVERY,
                updatedAt: { lt: twoHoursAgo }
            }
        });

        if (stuckOrders.length > 0) {
            this.logger.warn(`Found ${stuckOrders.length} stuck orders! IDs: ${stuckOrders.map(o => o.id).join(', ')}`);
            // Here you would trigger an alert to support team
        }
    }

    @Process('assignDeliveryPartner')
    async handleAssignment(job: Job<{ orderId: string }>) {
        this.logger.log(`Processing assignment for order ${job.data.orderId}`);
        // This logic mirrors the DeliveryService.findPartner code
        // Invoked via Event or Queue
    }
}
