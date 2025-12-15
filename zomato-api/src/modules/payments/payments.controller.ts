import { Controller, Post, Body, UseGuards, Headers, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Post('create-order')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a payment order' })
    @ApiResponse({ status: 201, description: 'Order created', schema: { example: { id: 'order_123', amount: 500, currency: 'INR' } } })
    async createOrder(@Request() req, @Body() body: { orderId: string }) {
        return this.paymentsService.createPaymentOrder(req.user.userId, body.orderId);
    }

    @Post('verify')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verify payment signature' })
    @ApiResponse({ status: 200, description: 'Payment verified' })
    async verifyPayment(@Body() body: { orderId: string; paymentId: string; razorpayOrderId: string; signature: string }) {
        return this.paymentsService.verifyPayment(body.orderId, body.paymentId, body.razorpayOrderId, body.signature);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Handle Razorpay Webhooks' })
    @ApiResponse({ status: 200, description: 'Webhook acknowledged' })
    async handleWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
        return { status: 'ok' };
    }
}
