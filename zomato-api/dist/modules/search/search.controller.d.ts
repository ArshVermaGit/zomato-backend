import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchRestaurants(q: string, filters?: string): Promise<import("@algolia/client-search").SearchResponse<unknown> | {
        hits: never[];
    }>;
    searchDishes(q: string, filters?: string): Promise<import("@algolia/client-search").SearchResponse<unknown> | {
        hits: never[];
    }>;
}
