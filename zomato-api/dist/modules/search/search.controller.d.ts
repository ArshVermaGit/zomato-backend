import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchRestaurants(q: string, filters?: string): unknown;
    searchDishes(q: string, filters?: string): unknown;
}
