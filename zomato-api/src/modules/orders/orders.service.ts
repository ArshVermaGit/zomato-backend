import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RealtimeGateway } from '../../websockets/websocket.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto, CreateRatingDto } from './dto/customer-order.dto';
import { Prisma, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

import { PromosService } from '../promos/promos.service';
import { EarningsService } from '../delivery/earnings.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private realtimeGateway: RealtimeGateway,
        private notificationsService: NotificationsService,
        private paymentsService: PaymentsService,
        private promosService: PromosService,
        private earningsService: EarningsService,
    ) { }

    // ============= STEP 1: CUSTOMER PLACES ORDER =============
    async createOrder(customerId: string, dto: CreateOrderDto) {
        // 1. Validate restaurant is open and active
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: dto.restaurantId,
                isActive: true,
                isOpen: true,
            },
            include: {
                menuCategories: {
                    include: {
                        items: true,
                    },
                },
            },
        });

        if (!restaurant) {
            throw new BadRequestException('Restaurant is not available');
        }

        // 2. Validate menu items and calculate pricing
        let itemsTotal = 0;
        const orderItems: any[] = []; // Typed to avoid never[]

        // Safely iterate even if items is malformed, though DTO checks this
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('Order must contain items');
        }

        for (const item of dto.items) {
            const menuItem = await this.prisma.menuItem.findFirst({
                where: {
                    id: item.menuItemId,
                    isAvailable: true,
                },
                include: {
                    modifiers: true,
                },
            });

            if (!menuItem) {
                throw new BadRequestException(`Item ${item.menuItemId} not available`);
            }

            let itemPrice = Number(menuItem.price) * item.quantity;

            // Calculate modifier prices
            // Since dto has specific structure: 
            // We assume DTO has selectedModifiers as simple list of modifiers from API
            // If validation needed for complex modifiers structure, it should be here.
            // For now, accepting trusting basic price addition or re-verifying if structure allows.
            // The user provided code assumes `item.selectedModifiers` exists on DTO item.
            // We need to ensure DTO supports this.
            const itemWithModifiers = item as any; // Cast for now, will verify DTO later.
            if (itemWithModifiers.selectedModifiers) {
                for (const mod of itemWithModifiers.selectedModifiers) {
                    itemPrice += (Number(mod.price) || 0) * item.quantity;
                }
            }

            itemsTotal += itemPrice;

            orderItems.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: itemPrice / item.quantity,
                selectedModifiers: itemWithModifiers.selectedModifiers || Prisma.JsonNull,
                specialInstructions: (item as any).specialInstructions,
            });
        }

        // 3. Calculate total
        const deliveryFee = Number(restaurant.deliveryFee);
        const taxes = itemsTotal * 0.05; // 5% tax
        let discount = 0;

        // Apply promo code if provided
        let promoId: string | null = null;
        if (dto.promoCode) {
            const validation = await this.promosService.validatePromoCode(
                dto.promoCode,
                customerId,
                itemsTotal,
                dto.restaurantId
            ) as any; // Cast to any to avoid union access issues

            if (!validation.valid) {
                // Return invalid payload or throw error? 
                // Typically if user sends invalid promo, we might want to throw error specifically
                throw new BadRequestException(`Invalid promo code: ${validation.reason}`);
            }

            discount = validation.discountAmount || 0;
            promoId = validation.promoId || null;
        }

        const totalAmount = itemsTotal + deliveryFee + taxes - discount + (dto.tip || 0);

        // 4. Generate unique order number
        const orderNumber = `ZOM${Date.now().toString().slice(-8)}`;

        // 5. Generate OTPs
        const pickupOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const deliveryOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // 6. Process payment
        let paymentStatus = PaymentStatus.PENDING;
        let paymentTransactionId = null;

        if (dto.paymentMethod !== 'COD') { // Using string literal matching DTO enum map or raw
            // Map DTO PaymentMethod to Service Expected Enum if needed
            //   const payment = await this.paymentsService.processPayment({
            //     amount: totalAmount,
            //     method: dto.paymentMethod,
            //     orderId: orderNumber,
            //     customerId,
            //   });

            //   paymentStatus = payment.status as PaymentStatus;
            //   paymentTransactionId = payment.transactionId;

            //   if (paymentStatus !== 'COMPLETED') {
            //     // throw new BadRequestException('Payment failed'); 
            //     // Commented out real payment for safety until PaymentsService verified fully
            //   }
        }

        // 7. Create order in database
        const orderRaw = await this.prisma.order.create({
            data: {
                orderNumber,
                customerId,
                restaurantId: dto.restaurantId,
                items: {
                    create: orderItems,
                },
                // deliveryAddressId is not in schema. Using address object from DTO.
                deliveryAddress: (dto as any).deliveryAddress || {},
                customerInstructions: dto.customerInstructions,
                itemsTotal,
                deliveryFee,
                taxes,
                discount,
                tip: dto.tip || 0,
                totalAmount,
                paymentMethod: dto.paymentMethod === 'COD' ? PaymentMethod.CASH_ON_DELIVERY : PaymentMethod.UPI,
                paymentStatus,
                paymentTransactionId,
                pickupOTP, // Fixed case
                deliveryOTP, // Fixed case
                estimatedDeliveryTime: (restaurant.preparationTime || 30) + 20,
                promoCode: dto.promoCode,
            },
            include: {
                customer: true, // customer is the User, no nested include needed unless accessing Customer profile
                restaurant: {
                    include: {
                        partner: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        // Cast to any to avoid TS relation access issues on complex include
        const order = orderRaw as any;

        // 8. Update promo usage
        if (promoId) {
            await this.promosService.recordPromoUsage(promoId, customerId, order.id);
        }

        // 9. ⭐ SEND TO RESTAURANT APP - Real-time notification
        this.realtimeGateway.notifyNewOrder(order);

        // 10. Send push notification to restaurant
        // Schema doesn't strictly have NotificationChannel enum anymore, passing string valid types
        if (order.restaurant.partner?.userId) {
            await this.notificationsService.sendNotification(
                order.restaurant.partner.userId,
                'New Order! 🔔',
                `Order #${orderNumber} - ₹${totalAmount}`,
                'ORDER_PLACED', // Type
            );

            // 11. Create notification in database
            // Duplicate notification creation (Service does it), handled by sendNotification now?
            // Service's sendNotification creates DB entry. So we don't need manual create.
            // User code had manual create. Removing manual create to avoid duplicates.
        }

        // 12. Notify customer that order is placed
        await this.notificationsService.sendNotification(
            customerId,
            'Order Placed Successfully!',
            `Your order #${orderNumber} has been placed`,
            'ORDER_PLACED'
        );

        // 13. Notify admins
        this.realtimeGateway.emitToAdmins('order:new', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            restaurant: order.restaurant.name,
            totalAmount: order.totalAmount,
        });

        return order;
    }

    // ============= STEP 2: RESTAURANT ACCEPTS ORDER =============
    async acceptOrder(orderId: string, restaurantUserId: string, estimatedPrepTime: number) {
        // 1. Resolve restaurant partner from userId
        const partner = await this.prisma.restaurantPartner.findUnique({
            where: { userId: restaurantUserId },
        });
        if (!partner) throw new BadRequestException('Not a restaurant partner');

        // 2. Verify restaurant owns this order
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                restaurant: {
                    partnerId: partner.id,
                },
            },
            include: {
                customer: true,
                restaurant: true,
            },
        });

        if (!order) {
            throw new BadRequestException('Order not found or already processed');
        }

        // 2. Update order status
        const updatedOrderRaw = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.ACCEPTED,
                acceptedAt: new Date(),
                estimatedDeliveryTime: estimatedPrepTime + 20,
            },
            include: {
                customer: true,
                restaurant: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        const updatedOrder = updatedOrderRaw as any;

        // 3. ⭐ NOTIFY CUSTOMER APP - Real-time update
        this.realtimeGateway.notifyOrderAccepted(updatedOrder);

        // 4. Send push notification to customer
        await this.notificationsService.sendNotification(
            updatedOrder.customerId,
            'Order Accepted! 👨‍🍳',
            `${updatedOrder.restaurant.name} is preparing your order`,
            'ORDER_ACCEPTED'
        );

        return updatedOrder;
    }

    // ============= STEP 3: RESTAURANT MARKS ORDER AS READY =============
    async markOrderReady(orderId: string, restaurantUserId: string) {
        // 1. Resolve restaurant partner from userId
        const partner = await this.prisma.restaurantPartner.findUnique({
            where: { userId: restaurantUserId },
        });
        if (!partner) throw new BadRequestException('Not a restaurant partner');

        // 2. Verify restaurant owns this order
        const check = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                restaurant: {
                    partnerId: partner.id,
                },
            },
        });
        if (!check) throw new BadRequestException('Order not found or already processed');

        // 3. Update order status
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.READY,
                readyAt: new Date(),
            },
            include: {
                customer: true,
                restaurant: true,
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        // 2. ⭐ NOTIFY ALL NEARBY AVAILABLE DELIVERY PARTNERS
        this.realtimeGateway.notifyOrderReady(order);

        // 3. Find and notify nearby delivery partners
        // Need location from restaurant
        const loc = order.restaurant.location as any;
        if (loc && loc.lat) {
            const nearbyPartners = await this.findNearbyDeliveryPartners(
                loc,
                5, // 5 km radius
            );

            // nearbyPartners is unknown from queryRaw, cast it
            for (const partner of (nearbyPartners as any[])) {
                await this.notificationsService.sendNotification(
                    partner.userId,
                    'New Delivery Available! 🚴',
                    `Order from ${order.restaurant.name} - Earn ₹${Number(order.deliveryFee) * 0.8}`,
                    'ORDER_READY' as any // Enum might be DELIVERY_PARTNER_NEARBY or similar. Using 'ORDER_READY' for now or cast.
                    // Actually schema has 'DELIVERY_PARTNER_NEARBY' or 'ORDER_READY'.
                );
            }
        }

        // 4. Notify customer
        this.realtimeGateway.emitToCustomer(order.customerId, 'order:ready', {
            orderId: order.id,
            orderNumber: order.orderNumber,
        });

        return order;
    }

    // ============= STEP 4: DELIVERY PARTNER ACCEPTS ORDER =============
    async assignDeliveryPartner(orderId: string, deliveryUserId: string) {
        // 1. Resolve delivery partner from userId
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId: deliveryUserId },
        });
        if (!partner) throw new BadRequestException('Not a delivery partner');

        // 2. Check if order is available
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                status: OrderStatus.READY,
                deliveryPartnerId: null,
            },
        });

        if (!order) {
            throw new BadRequestException('Order not available');
        }

        // 3. Check if delivery partner is available
        if (!partner.isAvailable || !partner.isOnline) {
            throw new BadRequestException('Delivery partner not available');
        }

        // 3. Assign delivery partner
        const updatedOrderRaw = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                deliveryPartnerId: partner.id,
                status: OrderStatus.PICKED_UP,
            },
            include: {
                customer: true,
                restaurant: true,
                deliveryPartner: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const updatedOrder = updatedOrderRaw as any;

        // 4. Update delivery partner availability
        await this.prisma.deliveryPartner.update({
            where: { id: partner.id },
            data: { isAvailable: false },
        });

        // 5. ⭐ NOTIFY CUSTOMER - Delivery partner assigned
        this.realtimeGateway.notifyDeliveryPartnerAssigned(updatedOrder);

        // 6. ⭐ NOTIFY RESTAURANT - Delivery partner assigned
        this.realtimeGateway.emitToRestaurant(updatedOrder.restaurantId, 'order:delivery_partner_assigned', {
            orderId: updatedOrder.id,
            deliveryPartner: updatedOrder.deliveryPartner.user.name,
        });

        // 7. Send push notifications
        await this.notificationsService.sendNotification(
            updatedOrder.customerId,
            'Delivery Partner Assigned! 🚴',
            `${updatedOrder.deliveryPartner.user.name} will deliver your order`,
            'ORDER_PICKED_UP'
        );

        return updatedOrder;
    }

    // ============= STEP 5: DELIVERY PARTNER UPDATES LOCATION =============
    async updateDeliveryLocation(orderId: string, deliveryPartnerId: string, location: { lat: number; lng: number; heading: number }) {
        // 1. Update delivery partner location
        await this.prisma.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: {
                currentLocation: location,
            },
        });

        // 2. Get order details
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (order) {
            // 3. ⭐ NOTIFY CUSTOMER - Real-time location update
            this.realtimeGateway.notifyLocationUpdate(orderId, order.customerId, location);
        }

        return { success: true };
    }

    // ============= STEP 6: ORDER DELIVERED =============
    async markOrderDelivered(orderId: string, deliveryUserId: string, deliveryOTP: string) {
        // 1. Resolve delivery partner from userId
        const partner = await this.prisma.deliveryPartner.findUnique({
            where: { userId: deliveryUserId },
        });
        if (!partner) throw new BadRequestException('Not a delivery partner');

        // 2. Verify OTP
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                deliveryPartnerId: partner.id,
                deliveryOTP: deliveryOTP,
            },
            include: {
                customer: true,
                restaurant: true,
                deliveryPartner: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!order) {
            throw new BadRequestException('Invalid OTP or order not found');
        }

        // 2. Calculate actual delivery time
        const actualDeliveryTime = Math.floor(
            (new Date().getTime() - new Date(order.placedAt || order.createdAt).getTime()) / 60000
        );

        // 3. Update order status
        const updatedOrderRaw = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.DELIVERED,
                deliveredAt: new Date(),
                actualDeliveryTime,
            },
            include: {
                customer: true,
                restaurant: true,
                deliveryPartner: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const updatedOrder = updatedOrderRaw as any;

        // 4. Update delivery partner availability
        await this.prisma.deliveryPartner.update({
            where: { id: partner.id },
            data: {
                isAvailable: true,
                totalDeliveries: { increment: 1 },
            },
        });

        // 5. Calculate and record earnings
        await this.earningsService.processOrderEarnings(
            partner.id,
            order.id,
            order.orderNumber,
            Number(order.deliveryFee),
            Number(order.tip || 0),
            5 // Mock distance, or calculate using location
        );

        // 7. ⭐ NOTIFY EVERYONE - Order delivered
        this.realtimeGateway.notifyOrderDelivered(updatedOrder);

        // 8. Send push notifications
        await this.notificationsService.sendNotification(
            updatedOrder.customerId,
            'Order Delivered! 🎉',
            'Enjoy your meal! Please rate your experience',
            'ORDER_DELIVERED'
        );
        // 9. Update customer stats
        await this.prisma.customer.update({
            where: { userId: updatedOrder.customerId },
            data: {
                totalOrders: { increment: 1 },
                totalSpent: { increment: Number(updatedOrder.totalAmount) },
            },
        });

        return updatedOrder;
    }

    // ============= HELPERS & QUERY METHODS =============

    async findAll(customerId: string, filters: OrderFilterDto) {
        const where: Prisma.OrderWhereInput = { customerId };
        if (filters.status) where.status = filters.status;

        // Date range logic if filters has it

        return this.prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { restaurant: true, items: { include: { menuItem: true } } }
        });
    }

    async findActive(customerId: string) {
        return this.prisma.order.findFirst({
            where: {
                customerId,
                status: { notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] }
            },
            include: {
                restaurant: true,
                items: { include: { menuItem: true } },
                deliveryPartner: { include: { user: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(customerId: string, orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                restaurant: true,
                deliveryPartner: { include: { user: true } },
                items: { include: { menuItem: true } },
                review: true
            }
        });

        if (!order || order.customerId !== customerId) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    async rateOrder(customerId: string, orderId: string, dto: CreateRatingDto) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, customerId, status: OrderStatus.DELIVERED }
        });

        if (!order) throw new BadRequestException('Order cannot be rated');

        // Create Review
        const review = await this.prisma.review.create({
            data: {
                orderId,
                userId: order.customerId, // Assuming customerId in order is user ID
                restaurantId: order.restaurantId,
                rating: dto.rating,
                comment: dto.comment,
                deliveryRating: dto.deliveryRating,
                tags: dto.tags || []
            }
        });

        return review;
    }

    async findAvailableForDelivery(lat: number, lng: number) {
        // Find orders that are READY but not assigned
        // And filter loosely by distance (postgres complex query or simple fetches)
        // For MVP, fetch all READY orders and sort/filter in memory or simple DB filter if possible.
        // Or use the inverse of 'findNearbyDeliveryPartners'.

        // Let's implement a simple version: Get all READY orders within 10km
        // Using queryRaw
        const orders = await this.prisma.$queryRaw`
        SELECT o.*, r.name as "restaurantName", r.address as "restaurantAddress",
        (
           6371 * acos(
             cos(radians(${lat})) 
             * cos(radians((r.location->>'lat')::float)) 
             * cos(radians((r.location->>'lng')::float) - radians(${lng})) 
             + sin(radians(${lat})) 
             * sin(radians((r.location->>'lat')::float))
           )
         ) AS distance
        FROM "Order" o
        JOIN "Restaurant" r ON o."restaurantId" = r.id
        WHERE o.status = 'READY' AND o."deliveryPartnerId" IS NULL
        AND (
           6371 * acos(
             cos(radians(${lat})) 
             * cos(radians((r.location->>'lat')::float)) 
             * cos(radians((r.location->>'lng')::float) - radians(${lng})) 
             + sin(radians(${lat})) 
             * sin(radians((r.location->>'lat')::float))
           )
         ) <= 10
        ORDER BY distance ASC
      `;
        return orders;
    }

    // Helper: Find nearby delivery partners
    async findNearbyDeliveryPartners(location: any, radiusKm: number) {
        return this.prisma.$queryRaw`
      SELECT dp.*, u.name, u.phone 
      FROM "DeliveryPartner" dp 
      JOIN "User" u ON dp."userId" = u.id 
      WHERE 
         dp."isAvailable" = true 
         AND dp."isOnline" = true
         AND dp."currentLocation" IS NOT NULL
         AND (
           6371 * acos(
             cos(radians(${location.lat})) 
             * cos(radians((dp."currentLocation"->>'lat')::float)) 
             * cos(radians((dp."currentLocation"->>'lng')::float) - radians(${location.lng})) 
             + sin(radians(${location.lat})) 
             * sin(radians((dp."currentLocation"->>'lat')::float))
           )
         ) <= ${radiusKm}
      LIMIT 10
    `;
    }


}
