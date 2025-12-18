"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportGenerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenerationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const s3_service_1 = require("../../common/services/s3.service");
const client_1 = require("@prisma/client");
let ReportGenerationService = ReportGenerationService_1 = class ReportGenerationService {
    prisma;
    s3Service;
    logger = new common_1.Logger(ReportGenerationService_1.name);
    constructor(prisma, s3Service) {
        this.prisma = prisma;
        this.s3Service = s3Service;
    }
    async createReportRequest(type, userId, criteria = {}) {
        const report = await this.prisma.report.create({
            data: {
                type,
                period: criteria.period || 'custom',
                status: client_1.ReportStatus.PENDING,
                generatedBy: userId,
                data: criteria
            }
        });
        this.generateReport(report.id, type, criteria).catch(err => {
            this.logger.error(`Report generation failed for ${report.id}`, err);
            this.prisma.report.update({
                where: { id: report.id },
                data: { status: client_1.ReportStatus.FAILED }
            });
        });
        return report;
    }
    async generateReport(reportId, type, criteria) {
        let data = [];
        let headers = [];
        try {
            if (type === client_1.ReportType.SALES) {
                const orders = await this.prisma.order.findMany({
                    where: { status: client_1.OrderStatus.DELIVERED },
                    take: 1000
                });
                headers = ['Order ID', 'Date', 'Amount', 'Restaurant', 'Customer'];
                data = orders.map(o => [o.orderNumber, o.createdAt.toISOString(), o.totalAmount, o.restaurantId, o.customerId]);
            }
            else if (type === client_1.ReportType.USERS) {
                const users = await this.prisma.user.findMany({
                    select: { id: true, name: true, email: true, role: true, createdAt: true },
                    take: 1000
                });
                headers = ['User ID', 'Name', 'Email', 'Role', 'Joined Date'];
                data = users.map(u => [u.id, u.name, u.email, u.role, u.createdAt.toISOString()]);
            }
            const csvContent = [
                headers.join(','),
                ...data.map(row => row.join(','))
            ].join('\n');
            const key = `reports/${type.toLowerCase()}_${reportId}_${Date.now()}.csv`;
            const url = await this.s3Service.uploadBuffer(key, Buffer.from(csvContent), 'text/csv');
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    status: client_1.ReportStatus.COMPLETED,
                    url: url
                }
            });
        }
        catch (error) {
            this.logger.error(`Error processing report ${reportId}`, error);
            await this.prisma.report.update({
                where: { id: reportId },
                data: { status: client_1.ReportStatus.FAILED }
            });
        }
    }
    async getReport(id) {
        return this.prisma.report.findUnique({ where: { id } });
    }
};
exports.ReportGenerationService = ReportGenerationService;
exports.ReportGenerationService = ReportGenerationService = ReportGenerationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], ReportGenerationService);
//# sourceMappingURL=report-generation.service.js.map