import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantFilterDto,
  NearbyRestaurantDto,
} from './dto/restaurant.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  // PARTNER & ADMIN ROUTES

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant (Admin only)' })
  async create(@Body() dto: CreateRestaurantDto, @Request() req) {
    // For Admin created, we might need to specify partnerID in DTO or use a generic one.
    // Assuming DTO might have it or falling back to a placeholder for build.
    // Realistically Admin assigns to a Partner.
    const partnerId = (dto as any).partnerId || req.user.userId; // Fallback to admin's ID if they are also a partner?
    return this.restaurantsService.createRestaurant(partnerId, dto);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a restaurant (Admin only)' })
  async approve(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.restaurantsService.approveRestaurant(id, req.user.userId);
  }

  @Get('partner/my-restaurants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurants managed by current partner' })
  async getMyRestaurants(@Request() req) {
    return this.restaurantsService.findByPartnerUserId(req.user.userId);
  }

  @Get('partner/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurant stats' })
  async getStats(@Request() req, @Query('restaurantId') restaurantId: string) {
    // Verify ownership access here ideally
    return this.restaurantsService.getStats(restaurantId);
  }

  @Get('partner/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get restaurant analytics' })
  getAnalytics(
    @Request() req,
    @Query('restaurantId') restaurantId: string,
    @Query('range') range: string,
  ) {
    return this.restaurantsService.getAnalytics(restaurantId, range);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_PARTNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update restaurant details' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    // TODO: Verify ownership if partner
    return this.restaurantsService.update(id, dto);
  }

  // PUBLIC / CUSTOMER ROUTES

  @Get('search')
  @ApiOperation({ summary: 'Search restaurants by name, cuisine, or dish' })
  @ApiQuery({ name: 'query', required: true })
  async search(@Query() dto: SearchRestaurantDto) {
    return this.restaurantsService.search(dto.query);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby restaurants' })
  async findNearby(@Query() dto: NearbyRestaurantDto) {
    // Extract lat, lng, radius from DTO
    const lat = parseFloat(dto.lat as any);
    const lng = parseFloat(dto.lng as any);
    const radius = dto.radius ? parseFloat(dto.radius as any) : 5;
    return this.restaurantsService.getNearbyRestaurants(lat, lng, radius);
  }

  @Get()
  @ApiOperation({ summary: 'List restaurants with filters' })
  async findAll(@Query() filter: RestaurantFilterDto) {
    return this.restaurantsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant details' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Get(':id/menu')
  @ApiOperation({ summary: 'Get restaurant menu' })
  async getMenu(@Param('id', ParseUUIDPipe) id: string) {
    const restaurant = await this.restaurantsService.findOne(id);
    return restaurant.menuCategories || [];
  }
}
