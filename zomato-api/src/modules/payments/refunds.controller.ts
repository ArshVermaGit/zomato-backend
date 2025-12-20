import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Refunds')
@Controller('payments/refunds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefundsController {
  constructor(private refundsService: RefundsService) {}

  @Get(':orderId/calculate')
  @ApiOperation({ summary: 'Calculate Potential Refund' })
  @ApiResponse({
    status: 200,
    description: 'Refund calculation details',
    schema: {
      example: { refundableAmount: 450, policy: 'Standard: 100% refund' },
    },
  })
  async calculateRefund(@Param('orderId') orderId: string) {
    return this.refundsService.calculateRefund(orderId);
  }

  @Post(':orderId')
  @ApiOperation({ summary: 'Initiate Refund' })
  @ApiResponse({ status: 201, description: 'Refund processed successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['GATEWAY', 'WALLET'] },
        reason: { type: 'string' },
      },
    },
  })
  async processRefund(
    @Param('orderId') orderId: string,
    @Body('type') type: 'GATEWAY' | 'WALLET',
    @Body('reason') reason: string,
  ) {
    return this.refundsService.processRefund(orderId, type, reason);
  }
}
