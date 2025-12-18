import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ReportGenerationService } from './report-generation.service';
import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [AnalyticsController],
    providers: [AnalyticsService, ReportGenerationService, PrismaService, S3Service, ConfigService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
