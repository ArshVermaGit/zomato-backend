import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ReportGenerationService } from './report-generation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, ReportType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // Default: Admin only
@ApiBearerAuth()
export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService,
        private readonly reportService: ReportGenerationService
    ) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get Dashboard Overview Metrics' })
    @ApiResponse({ status: 200, description: 'Dashboard metrics returned' })
    async getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }

    @Get('orders')
    @ApiOperation({ summary: 'Get Order Analytics' })
    @ApiQuery({ name: 'range', required: false, enum: ['daily', 'weekly', 'monthly'] })
    @ApiResponse({ status: 200, description: 'Order analytics metrics' })
    async getOrders(@Query('range') range: 'daily' | 'weekly' | 'monthly') {
        return this.analyticsService.getOrderAnalytics(range);
    }

    @Get('revenue')
    @ApiOperation({ summary: 'Get Revenue Analytics' })
    @ApiQuery({ name: 'range', required: false, enum: ['daily', 'weekly', 'monthly'] })
    @ApiResponse({ status: 200, description: 'Revenue analytics metrics' })
    async getRevenue(@Query('range') range: 'daily' | 'weekly' | 'monthly') {
        return this.analyticsService.getRevenueAnalytics(range);
    }

    @Post('reports/generate')
    @ApiOperation({ summary: 'Generate Analytics Report' })
    @ApiResponse({ status: 201, description: 'Report generation started' })
    @ApiBody({ schema: { example: { type: 'SALES', criteria: {} } } })
    async generateReport(@Request() req, @Body() body: { type: ReportType; criteria?: any }) {
        return this.reportService.createReportRequest(body.type, req.user.userId, body.criteria);
    }

    @Get('reports/:id')
    @ApiOperation({ summary: 'Get Report Status/URL' })
    @ApiResponse({ status: 200, description: 'Report details' })
    async getReport(@Param('id') id: string) {
        return this.reportService.getReport(id);
    }
}
