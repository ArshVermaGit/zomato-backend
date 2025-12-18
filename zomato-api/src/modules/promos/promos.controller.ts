import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { PromosService } from './promos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Promos')
@Controller('promos')
export class PromosController {
    constructor(private promosService: PromosService) { }

    @Get('available')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get available promos' })
    @ApiResponse({ status: 200, description: 'List of available promos' })
    async getAvailable(@Request() req, @Query('restaurantId') restaurantId: string) {
        return this.promosService.getAvailablePromos(req.user.userId, restaurantId);
    }

    @Post('validate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Validate promo code (real-time)' })
    @ApiResponse({ status: 200, description: 'Validation result' })
    async validatePromo(@Request() req, @Body() body: { code: string; cartValue: number; restaurantId: string }) {
        return this.promosService.validatePromoCode(body.code, req.user.userId, body.cartValue, body.restaurantId);
    }

    @Post('apply')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Apply promo code' })
    @ApiResponse({ status: 200, description: 'Promo applied successfully' })
    async applyPromo(@Request() req, @Body() body: { code: string; cartValue: number; restaurantId: string }) {
        return this.promosService.applyPromo(body.code, req.user.userId, body.cartValue, body.restaurantId);
    }

    @Get('best')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get best applicable promo automatically' })
    @ApiResponse({ status: 200, description: 'Best promo or null' })
    async getBestPromo(@Request() req, @Query('cartValue') cartValue: string, @Query('restaurantId') restaurantId: string) {
        return this.promosService.getBestPromo(req.user.userId, parseFloat(cartValue), restaurantId);
    }

    @Post()
    @ApiOperation({ summary: 'Create promo (Admin)' })
    @ApiResponse({ status: 201, description: 'Promo created successfully' })
    async createPromo(@Body() body: any) {
        return this.promosService.createPromo(body);
    }
}
