import { Controller, Post, Put, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { OnboardDeliveryPartnerDto, UpdateVehicleDto } from './dto/delivery-onboarding.dto';
import { EarningsService } from './earnings.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, OnboardingStatus } from '@prisma/client';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
    constructor(
        private deliveryService: DeliveryService,
        private earningsService: EarningsService
    ) { }

    // --- EARNINGS & PAYOUTS ---
    @Get('earnings')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get earnings summary' })
    @ApiResponse({ status: 200, description: 'Earnings summary' })
    async getEarnings(@Request() req) {
        return this.earningsService.getBalance(req.user.userId);
    }

    @Get('earnings/transactions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get transaction history' })
    @ApiResponse({ status: 200, description: 'Transaction history' })
    async getTransactions(@Request() req) {
        return this.earningsService.getTransactions(req.user.userId);
    }

    @Post('payout/request')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request payout' })
    @ApiResponse({ status: 201, description: 'Payout requested' })
    @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number' } } } })
    async requestPayout(@Request() req, @Body('amount') amount: number) {
        return this.earningsService.requestPayout(req.user.userId, amount);
    }

    @Get('payout/history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get payout history' })
    @ApiResponse({ status: 200, description: 'Payout history' })
    async getPayoutHistory(@Request() req) {
        return this.earningsService.getPayoutHistory(req.user.userId);
    }

    @Get('performance')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get performance metrics' })
    @ApiResponse({ status: 200, description: 'Performance metrics' })
    async getPerformance(@Request() req) {
        return this.earningsService.getPerformanceMetrics(req.user.userId);
    }

    @Post('onboard')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit onboarding details' })
    @ApiResponse({ status: 201, description: 'Onboarding data submitted' })
    async onboard(@Request() req, @Body() dto: OnboardDeliveryPartnerDto) {
        return this.deliveryService.onboard(req.user.userId, dto);
    }

    @Post('documents/upload-url')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get S3 presigned URL for document upload' })
    @ApiResponse({ status: 201, description: 'Presigned URL returned' })
    @ApiBody({ schema: { type: 'object', properties: { docType: { type: 'string', example: 'license_front' } } } })
    async getUploadUrl(@Request() req, @Body('docType') docType: string) {
        return this.deliveryService.getUploadUrl(req.user.userId, docType);
    }

    @Post('documents/confirm')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Confirm document upload' })
    @ApiResponse({ status: 200, description: 'Document status updated' })
    @ApiBody({ schema: { type: 'object', properties: { docType: { type: 'string' }, url: { type: 'string' } } } })
    async confirmUpload(@Request() req, @Body() body: { docType: string, url: string }) {
        return this.deliveryService.updateDocumentStatus(req.user.userId, body.docType, body.url);
    }

    @Get('onboarding-status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get onboarding status' })
    @ApiResponse({ status: 200, description: 'Current status' })
    async getStatus(@Request() req) {
        return this.deliveryService.getStatus(req.user.userId);
    }

    @Put('vehicle-details')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update vehicle details' })
    @ApiResponse({ status: 200, description: 'Vehicle details updated' })
    async updateVehicle(@Request() req, @Body() dto: UpdateVehicleDto) {
        return this.deliveryService.updateVehicle(req.user.userId, dto);
    }

    // ADMIN
    @Put(':partnerId/verify')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verify or Reject Partner (Admin)' })
    @ApiResponse({ status: 200, description: 'Partner status updated' })
    @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['VERIFIED', 'REJECTED'] } } } })
    async verifyPartner(@Param('partnerId') partnerId: string, @Body('status') status: OnboardingStatus) {
        return this.deliveryService.verifyPartner(partnerId, status);
    }
}
