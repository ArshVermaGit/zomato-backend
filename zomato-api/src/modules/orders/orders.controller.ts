import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  CancelOrderDto,
  AssignDeliveryPartnerDto,
} from './dto/order-status.dto';
import { OrderFilterDto, CreateRatingDto } from './dto/customer-order.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private orderStateService: OrderStateService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  // CUSTOMER ENDPOINTS

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my orders (History)' })
  async listOrders(@Request() req, @Query() filters: OrderFilterDto) {
    return this.ordersService.findAll(req.user.userId, filters);
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active order' })
  async getActiveOrder(@Request() req) {
    return this.ordersService.findActive(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details' })
  async getOrder(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(req.user.userId, id);
  }

  @Post(':id/rating')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate an order' })
  async rateOrder(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ordersService.rateOrder(req.user.userId, id, dto);
  }

  // RESTAURANT ACTIONS

  @Put(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept order' })
  async acceptOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() dto: { estimatedPrepTime: number },
  ) {
    return this.ordersService.acceptOrder(
      id,
      req.user.userId,
      dto.estimatedPrepTime,
    );
  }

  @Put(':id/preparing')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark order as preparing' })
  async prepareOrder(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.orderStateService.transition(
      id,
      OrderStatus.PREPARING,
      req.user.userId,
      req.user.role,
    );
  }

  @Put(':id/ready')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark order as ready for pickup' })
  async readyOrder(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.markOrderReady(id, req.user.userId);
  }

  // SYSTEM / ADMIN ACTIONS

  @Put(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Or internal system
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign delivery partner' })
  async assignOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignDeliveryPartnerDto,
  ) {
    return this.orderStateService.assignPartner(id, dto.deliveryPartnerId);
  }

  // DELIVERY PARTNER ACTIONS

  @Put(':id/claim')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Claim (Accept) order for delivery' })
  async claimOrder(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.assignDeliveryPartner(id, req.user.userId);
  }

  @Put(':id/pickup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pickup order' })
  async pickupOrder(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.orderStateService.transition(
      id,
      OrderStatus.PICKED_UP,
      req.user.userId,
      req.user.role,
    ); // TODO: Pass deliveryPartner ID handled in service
  }

  @Put(':id/deliver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deliver order' })
  async deliverOrder(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { deliveryOTP: string },
  ) {
    return this.ordersService.markOrderDelivered(
      id,
      req.user.userId,
      dto.deliveryOTP,
    );
  }

  @Get('delivery/available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find available orders for delivery' })
  async findAvailableForDelivery(
    @Request() req,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    if (!lat || !lng) return []; // Require location
    return this.ordersService.findAvailableForDelivery(
      parseFloat(lat),
      parseFloat(lng),
    );
  }

  // GENERAL ACTIONS

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard) // Any auth user, role checked in service
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel order' })
  async cancelOrder(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelOrderDto,
  ) {
    return this.orderStateService.transition(
      id,
      OrderStatus.CANCELLED,
      req.user.userId,
      req.user.role,
      dto.reason,
    );
  }
}
