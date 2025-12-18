import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { S3Service } from '../../common/services/s3.service';
import { ReportType, ReportStatus, OrderStatus } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class ReportGenerationService {
    private readonly logger = new Logger(ReportGenerationService.name);

    constructor(
        private prisma: PrismaService,
        private s3Service: S3Service
    ) { }

    async createReportRequest(type: ReportType, userId: string, criteria: any = {}) {
        // Create Request Record
        const report = await this.prisma.report.create({
            data: {
                type,
                period: criteria.period || 'custom', // Default to custom if missing
                status: ReportStatus.PENDING,
                generatedBy: userId,
                data: criteria // Move criteria into the 'data' JSON field
            }
        });

        // Trigger Async Generation (Fire & Forget for MVP)
        this.generateReport(report.id, type, criteria).catch(err => {
            this.logger.error(`Report generation failed for ${report.id}`, err);
            this.prisma.report.update({
                where: { id: report.id },
                data: { status: ReportStatus.FAILED }
            });
        });

        return report;
    }

    private async generateReport(reportId: string, type: ReportType, criteria: any) {
        let data: any[] = [];
        let headers: string[] = [];

        try {
            if (type === ReportType.SALES) {
                const orders = await this.prisma.order.findMany({
                    where: { status: OrderStatus.DELIVERED },
                    take: 1000 // Limit for MVP
                });
                headers = ['Order ID', 'Date', 'Amount', 'Restaurant', 'Customer'];
                data = orders.map(o => [o.orderNumber, o.createdAt.toISOString(), o.totalAmount, o.restaurantId, o.customerId]);
            } else if (type === ReportType.USERS) {
                const users = await this.prisma.user.findMany({
                    select: { id: true, name: true, email: true, role: true, createdAt: true },
                    take: 1000
                });
                headers = ['User ID', 'Name', 'Email', 'Role', 'Joined Date'];
                data = users.map(u => [u.id, u.name, u.email, u.role, u.createdAt.toISOString()]);
            }

            // Convert to CSV
            const csvContent = [
                headers.join(','),
                ...data.map(row => row.join(','))
            ].join('\n');

            // Upload to S3
            const key = `reports/${type.toLowerCase()}_${reportId}_${Date.now()}.csv`;
            const url = await this.s3Service.uploadBuffer(key, Buffer.from(csvContent), 'text/csv');

            // Update Report Record
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    status: ReportStatus.COMPLETED,
                    url: url
                }
            });

        } catch (error) {
            this.logger.error(`Error processing report ${reportId}`, error);
            await this.prisma.report.update({
                where: { id: reportId },
                data: { status: ReportStatus.FAILED }
            });
        }
    }

    async getReport(id: string) {
        return this.prisma.report.findUnique({ where: { id } });
    }
}
