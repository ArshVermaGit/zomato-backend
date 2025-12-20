import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { ReportType } from '@prisma/client';
export declare class ReportGenerationService {
    private prisma;
    private s3Service;
    private readonly logger;
    constructor(prisma: PrismaService, s3Service: S3Service);
    createReportRequest(type: ReportType, userId: string, criteria?: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        data: import("@prisma/client/runtime/library").JsonValue;
        type: import(".prisma/client").$Enums.ReportType;
        period: string;
        generatedBy: string | null;
        url: string | null;
    }>;
    private generateReport;
    getReport(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        data: import("@prisma/client/runtime/library").JsonValue;
        type: import(".prisma/client").$Enums.ReportType;
        period: string;
        generatedBy: string | null;
        url: string | null;
    } | null>;
}
