import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { io, Socket } from 'socket.io-client';
import { UserRole } from '@prisma/client';

describe('Complete Zomato Flow (E2E)', () => {
    let app: INestApplication;
    let socket: Socket;
    let url: string;

    jest.setTimeout(60000); // Increase timeout for E2E flow

    // Data Store
    const uniqueId = Date.now();
    const adminUser = {
        email: `admin_${uniqueId}@test.com`,
        phone: `999${uniqueId.toString().slice(-7)}`,
        password: 'password123',
        role: 'ADMIN',
        token: ''
    };
    const restaurantUser = {
        email: `rest_${uniqueId}@test.com`,
        phone: `888${uniqueId.toString().slice(-7)}`,
        password: 'password123',
        role: 'RESTAURANT_PARTNER',
        id: '',
        partnerId: '',
        token: ''
    };
    const customerUser = {
        email: `cust_${uniqueId}@test.com`,
        phone: `777${uniqueId.toString().slice(-7)}`,
        password: 'password123',
        role: 'CUSTOMER',
        id: '',
        token: ''
    };
    const deliveryPartnerUser = {
        email: `del_${uniqueId}@test.com`,
        phone: `666${uniqueId.toString().slice(-7)}`,
        password: 'password123',
        role: 'DELIVERY_PARTNER',
        id: '',
        partnerId: '',
        token: ''
    };

    let restaurantId: string;
    let menuCategoryId: string;
    let menuItemId: string;
    let orderId: string;
    let orderNumber: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.listen(0);
        url = await app.getUrl();
    });

    afterAll(async () => {
        if (socket) socket.disconnect();
        if (app) await app.close();
    });

    // Helper to register users
    const registerUser = async (user: any) => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                name: 'Test Identity',
                email: user.email,
                phone: user.phone,
                password: user.password,
                role: user.role
            });

        // If 409 conflict, try login (idempotency check for repeated test runs if needed, though we use unique IDs)
        if (res.status === 201 || res.status === 200) {
            user.token = res.body.accessToken;
            user.id = res.body.user.id;
            console.log(`Registered ${user.email} with ID: ${user.id}`);
        } else {
            console.log(`Registration failed for ${user.email}: ${res.status}`, res.body);
            const login = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: user.email, password: user.password });

            if (login.status === 200 || login.status === 201) {
                user.token = login.body.accessToken;
                user.id = login.body.user.id;
            } else {
                console.log(`Login failed for ${user.email}: ${login.status}`, login.body);
            }
        }
        return res;
    };

    it('1. Setup Users', async () => {
        await registerUser(adminUser);
        await registerUser(restaurantUser);
        await registerUser(customerUser);
        await registerUser(deliveryPartnerUser);

        // Map User IDs to Partner/Customer records because the signup doesn't auto-create them
        // We can do this via Prisma directly in the test since we have access
        const prisma = new (require('@prisma/client').PrismaClient)();

        // Create RestaurantPartner record
        const restPartner = await prisma.restaurantPartner.upsert({
            where: { userId: restaurantUser.id },
            update: {},
            create: { userId: restaurantUser.id }
        });
        restaurantUser.partnerId = restPartner.id;

        // Create DeliveryPartner record
        const delPartner = await prisma.deliveryPartner.upsert({
            where: { userId: deliveryPartnerUser.id },
            update: { isAvailable: true, isOnline: true },
            create: {
                userId: deliveryPartnerUser.id,
                vehicleType: 'BIKE',
                vehicleNumber: 'TS01E1234',
                licenseNumber: 'L123456789',
                isAvailable: true,
                isOnline: true,
                onboardingStatus: 'VERIFIED',
                documentsVerified: true
            }
        });
        deliveryPartnerUser.partnerId = delPartner.id;

        // Create Customer record
        await prisma.customer.upsert({
            where: { userId: customerUser.id },
            update: {},
            create: { userId: customerUser.id }
        });

        await prisma.$disconnect();

        expect(adminUser.token).toBeDefined();
        expect(restaurantUser.token).toBeDefined();
        expect(customerUser.token).toBeDefined();
        expect(deliveryPartnerUser.token).toBeDefined();
    });

    it('2. WebSocket Connection', (done) => {
        socket = io(url + '/realtime', {
            auth: { token: customerUser.token }
        });
        socket.on('connect', () => {
            expect(socket.connected).toBe(true);
            done();
        });
    });

    it('3. Create Restaurant (Restaurant Partner)', async () => {
        const res = await request(app.getHttpServer())
            .post('/restaurants')
            .set('Authorization', `Bearer ${adminUser.token}`)
            .send({
                name: 'E2E Test Bistro',
                description: 'Best test food',
                phone: restaurantUser.phone,
                email: restaurantUser.email,
                location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore' },
                cuisineTypes: ['Italian'],
                deliveryFee: 50,
                deliveryRadius: 10,
                preparationTime: 15,
                partnerId: restaurantUser.partnerId
            });

        expect(res.status).toBe(201);
        restaurantId = res.body.id;

        // Approve the restaurant (Admin)
        const approveRes = await request(app.getHttpServer())
            .put(`/restaurants/${restaurantId}/approve`)
            .set('Authorization', `Bearer ${adminUser.token}`)
            .send();
        expect(approveRes.status).toBe(200);

        // Open the restaurant
        await request(app.getHttpServer())
            .put(`/restaurants/${restaurantId}`)
            .set('Authorization', `Bearer ${restaurantUser.token}`)
            .send({ isOpen: true });
    });

    it('4. Add Menu (Restaurant Partner)', async () => {
        // Add Category
        const catRes = await request(app.getHttpServer())
            .post('/menu/categories')
            .set('Authorization', `Bearer ${restaurantUser.token}`)
            .send({ name: 'Main Course', restaurantId });
        menuCategoryId = catRes.body.id;

        // Add Item
        const itemRes = await request(app.getHttpServer())
            .post('/menu/items')
            .set('Authorization', `Bearer ${restaurantUser.token}`)
            .send({
                categoryId: menuCategoryId,
                name: 'Test Pasta',
                description: 'Yummy',
                price: 200,
                isVeg: true
            });
        menuItemId = itemRes.body.id;
        expect(menuItemId).toBeDefined();
    });

    it('5. Place Order (Customer) -> Verify WebSocket', async () => {
        // Create Address first
        const addrRes = await request(app.getHttpServer())
            .post('/users/addresses') // Base URL check for AddressesController
            .set('Authorization', `Bearer ${customerUser.token}`)
            .send({
                label: 'Home',
                fullAddress: '123 Test Street, Bangalore',
                lat: 12.9716,
                lng: 77.5946
            });
        const addressId = addrRes.body.id;

        const restaurantSocket = io(url + '/realtime', {
            auth: { token: restaurantUser.token }
        });

        const notificationPromise = new Promise<void>((resolve) => {
            restaurantSocket.on('order:new', (data) => resolve());
            restaurantSocket.on('notification', (payload) => {
                if (payload.type === 'ORDER_PLACED') resolve();
            });
        });

        // Join restaurant room
        restaurantSocket.emit('join_restaurant', { restaurantId });

        const res = await request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${customerUser.token}`)
            .send({
                restaurantId,
                items: [{ menuItemId, quantity: 2 }],
                deliveryAddressId: addressId,
                paymentMethod: 'UPI'
            });

        expect(res.status).toBe(201);
        orderId = res.body.id;
        orderNumber = res.body.orderNumber;
        expect(orderId).toBeDefined();

        await notificationPromise;
        restaurantSocket.disconnect();
    });

    it('6. Accept Order (Restaurant) -> Verify Customer WS', async () => {
        const customerPromise = new Promise<void>((resolve) => {
            socket.on('order:accepted', (data) => resolve());
            socket.on('notification', (payload) => {
                if (payload.type === 'ORDER_ACCEPTED') resolve();
            });
        });

        const res = await request(app.getHttpServer())
            .put(`/orders/${orderId}/accept`)
            .set('Authorization', `Bearer ${restaurantUser.token}`)
            .send({ estimatedPrepTime: 15 });

        expect(res.status).toBe(200);
        await customerPromise;
    });

    it('7. Mark Ready (Restaurant) -> Verify Delivery WS', async () => {
        // Setup Delivery Socket
        const deliverySocket = io(url + '/realtime', {
            auth: { token: deliveryPartnerUser.token }
        });

        const deliveryPromise = new Promise<void>((resolve) => {
            deliverySocket.on('order:available', () => resolve());
            deliverySocket.on('notification', (payload) => {
                if (payload.type === 'ORDER_READY') resolve();
            });
        });

        const res = await request(app.getHttpServer())
            .put(`/orders/${orderId}/ready`)
            .set('Authorization', `Bearer ${restaurantUser.token}`)
            .send();

        expect(res.status).toBe(200);
        await deliveryPromise;
        deliverySocket.disconnect();
    });

    it('8. Claim Order (Delivery Partner) -> Verify Customer WS', async () => {
        const customerPromise = new Promise<void>((resolve) => {
            socket.on('order:delivery_partner_assigned', () => resolve());
        });

        // Partner accepts
        const res = await request(app.getHttpServer())
            .put(`/orders/${orderId}/claim`)
            .set('Authorization', `Bearer ${deliveryPartnerUser.token}`)
            .send(); // assumes token owner is the partner

        expect(res.status).toBe(200);
        await customerPromise;
    });

    it('9. Complete Delivery (Delivery Partner) -> Verify Earnings', async () => {
        // Get Order to find OTP
        const orderRes = await request(app.getHttpServer())
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${customerUser.token}`);

        const otp = orderRes.body.deliveryOTP;
        expect(otp).toBeDefined();

        // Mark Delivered
        const res = await request(app.getHttpServer())
            .put(`/orders/${orderId}/deliver`)
            .set('Authorization', `Bearer ${deliveryPartnerUser.token}`)
            .send({ deliveryOTP: otp });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('DELIVERED');

        // Verify Earnings via Prisma directly
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const calculation = await prisma.earning.findFirst({
            where: { orderId: orderId }
        });
        expect(calculation).toBeDefined();
        await prisma.$disconnect();
    });
});
