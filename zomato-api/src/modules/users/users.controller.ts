import { Controller, Get, Put, Post, Body, Param, Delete, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.userId);
    }

    @Put('me')
    @ApiOperation({ summary: 'Update current user profile' })
    async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, dto);
    }

    @Post('me/avatar/upload-url')
    @ApiOperation({ summary: 'Get signed URL for avatar upload' })
    async getAvatarUploadUrl(@Request() req) {
        return this.usersService.getAvatarUploadUrl(req.user.userId);
    }

    // Optional: Endpoint to confirm avatar update if client uploads directly to S3
    @Put('me/avatar')
    @ApiOperation({ summary: 'Update avatar URL after S3 upload' })
    async updateAvatar(@Request() req, @Body('avatarUrl') avatarUrl: string) {
        return this.usersService.updateAvatar(req.user.userId, avatarUrl);
    }

    @Get('addresses')
    @ApiOperation({ summary: 'Get all addresses for user' })
    async getAddresses(@Request() req) {
        return this.usersService.getAddresses(req.user.userId);
    }

    @Post('addresses')
    @ApiOperation({ summary: 'Add a new address' })
    async createAddress(@Request() req, @Body() dto: CreateAddressDto) {
        return this.usersService.createAddress(req.user.userId, dto);
    }

    @Put('addresses/:id')
    @ApiOperation({ summary: 'Update an address' })
    async updateAddress(
        @Request() req,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.usersService.updateAddress(req.user.userId, id, dto);
    }

    @Delete('addresses/:id')
    @ApiOperation({ summary: 'Delete an address' })
    async deleteAddress(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteAddress(req.user.userId, id);
    }

    @Put('addresses/:id/default')
    @ApiOperation({ summary: 'Set address as default' })
    async setDefaultAddress(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.setDefaultAddress(req.user.userId, id);
    }

    @Delete('me')
    @ApiOperation({ summary: 'Deactivate account' })
    async deactivateAccount(@Request() req) {
        // Soft delete logic usually
        return this.usersService.update(req.user.userId, { isActive: false });
    }
}
