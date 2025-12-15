import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiPropertyOptional({ default: 'createdAt' })
    @IsOptional()
    @IsString()
    sortBy: string = 'createdAt';

    @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toLowerCase())
    sortOrder: 'asc' | 'desc' = 'desc';
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

export function paginate<T>(
    data: T[],
    total: number,
    pagination: PaginationDto
): PaginatedResponse<T> {
    const { page, limit } = pagination;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}

// Prisma pagination helper
export function getPrismaSkipTake(pagination: PaginationDto) {
    const { page, limit } = pagination;
    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}

// Cursor-based pagination helper
export function getCursorPagination(pagination: PaginationDto) {
    const { cursor, limit } = pagination;
    return {
        take: limit,
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor },
        }),
    };
}
