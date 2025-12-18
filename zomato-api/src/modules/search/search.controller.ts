import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get('restaurants')
    @ApiOperation({ summary: 'Search restaurants' })
    @ApiQuery({ name: 'q', required: true })
    async searchRestaurants(@Query('q') q: string, @Query('filters') filters?: string) {
        return this.searchService.searchRestaurants(q, filters);
    }

    @Get('dishes')
    @ApiOperation({ summary: 'Search dishes' })
    @ApiQuery({ name: 'q', required: true })
    async searchDishes(@Query('q') q: string, @Query('filters') filters?: string) {
        return this.searchService.searchDishes(q, filters);
    }
}
