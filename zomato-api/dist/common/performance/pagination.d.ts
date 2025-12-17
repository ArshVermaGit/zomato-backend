export declare class PaginationDto {
    page: number;
    limit: number;
    cursor?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare function paginate<T>(data: T[], total: number, pagination: PaginationDto): PaginatedResponse<T>;
export declare function getPrismaSkipTake(pagination: PaginationDto): {
    skip: number;
    take: number;
};
export declare function getCursorPagination(pagination: PaginationDto): {
    skip?: number | undefined;
    cursor?: {
        id: string;
    } | undefined;
    take: number;
};
