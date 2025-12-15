import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { ReportType } from '@prisma/client';
export declare class ReportGenerationService {
    private prisma;
    private s3Service;
    private readonly logger;
    constructor(prisma: PrismaService, s3Service: S3Service);
    createReportRequest(type: ReportType, userId: string, criteria?: any): Promise<{
        url: string | null;
        type: import("@prisma/client").$Enums.ReportType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReportStatus;
        generatedBy: string;
        criteria: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    private generateReport;
    getReport(id: string): Promise<{
        url: string | null;
        type: import("@prisma/client").$Enums.ReportType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReportStatus;
        generatedBy: string;
        criteria: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
}
