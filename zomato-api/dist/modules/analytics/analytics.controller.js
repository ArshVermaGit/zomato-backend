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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const report_generation_service_1 = require("./report-generation.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    reportService;
    constructor(analyticsService, reportService) {
        this.analyticsService = analyticsService;
        this.reportService = reportService;
    }
    async getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }
    async getOrders(range) {
        return this.analyticsService.getOrderAnalytics(range);
    }
    async getRevenue(range) {
        return this.analyticsService.getRevenueAnalytics(range);
    }
    async generateReport(req, body) {
        return this.reportService.createReportRequest(body.type, req.user.userId, body.criteria);
    }
    async getReport(id) {
        return this.reportService.getReport(id);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Dashboard Overview Metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard metrics returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Order Analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'range', required: false, enum: ['daily', 'weekly', 'monthly'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order analytics metrics' }),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Revenue Analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'range', required: false, enum: ['daily', 'weekly', 'monthly'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue analytics metrics' }),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate Analytics Report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generation started' }),
    (0, swagger_1.ApiBody)({ schema: { example: { type: 'SALES', criteria: {} } } }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Report Status/URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReport", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        report_generation_service_1.ReportGenerationService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map