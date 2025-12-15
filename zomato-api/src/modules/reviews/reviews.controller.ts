import { Controller, Post, Body, Get, Param, UseGuards, Request, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a review' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    async createReview(@Request() req, @Body() dto: any) {
        return this.reviewsService.createReview(req.user.userId, dto);
    }

    @Get('restaurant/:id')
    @ApiOperation({ summary: 'Get reviews for a restaurant' })
    @ApiResponse({ status: 200, description: 'List of reviews' })
    async getRestaurantReviews(@Param('id') id: string) {
        return this.reviewsService.getRestaurantReviews(id);
    }

    @Post(':id/helpful')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark review as helpful' })
    @ApiResponse({ status: 200, description: 'Marked as helpful' })
    async markHelpful(@Param('id') id: string) {
        return this.reviewsService.markHelpful(id);
    }

    @Post(':id/report')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Report a review' })
    @ApiResponse({ status: 200, description: 'Review reported' })
    async reportReview(@Param('id') id: string) {
        return this.reviewsService.reportReview(id);
    }

    @Post(':id/respond')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Respond to a review (Restaurant Owner)' })
    @ApiResponse({ status: 200, description: 'Response added' })
    async respondToReview(@Request() req, @Param('id') id: string, @Body('response') response: string) {
        return this.reviewsService.respondToReview(req.user.userId, id, response);
    }
}
