import { Controller, Post, Body, Get, Put, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Post('register-device')
    @ApiOperation({ summary: 'Register FCM Token' })
    @ApiResponse({ status: 201, description: 'Device registered successfully' })
    async registerDevice(@Request() req, @Body('token') token: string) {
        return this.notificationsService.registerDevice(req.user.userId, token);
    }

    @Get()
    @ApiOperation({ summary: 'Get User Notifications' })
    @ApiResponse({ status: 200, description: 'List of notifications' })
    async getUserNotifications(@Request() req) {
        return this.notificationsService.getUserNotifications(req.user.userId);
    }

    @Put(':id/read')
    @ApiOperation({ summary: 'Mark Notification as Read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    async markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }
}
