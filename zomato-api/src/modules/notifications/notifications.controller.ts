import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register-token')
  @ApiOperation({ summary: 'Register FCM token for push notifications' })
  async registerToken(@Req() req: Request, @Body() body: { token: string }) {
    // @ts-expect-error: req.user is populated by JwtAuthGuard
    const userId = req.user.userId;
    await this.notificationsService.registerFCMToken(userId, body.token);
    return { success: true };
  }
}
