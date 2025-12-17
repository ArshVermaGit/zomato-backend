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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const delivery_service_1 = require("./delivery.service");
const delivery_onboarding_dto_1 = require("./dto/delivery-onboarding.dto");
const earnings_service_1 = require("./earnings.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DeliveryController = class DeliveryController {
    deliveryService;
    earningsService;
    constructor(deliveryService, earningsService) {
        this.deliveryService = deliveryService;
        this.earningsService = earningsService;
    }
    async requestPayout(req, amount) {
        return this.earningsService.requestPayout(req.user.userId, amount);
    }
    async getTransactions(req) {
        return this.earningsService.getHistory(req.user.userId);
    }
    async getPayoutHistory(req) {
        return this.earningsService.getPayoutRequests(req.user.userId);
    }
    async getPerformanceMetrics(req) {
        return this.earningsService.getStats(req.user.userId);
    }
    async onboard(req, dto) {
        return this.deliveryService.onboard(req.user.userId, dto);
    }
    async getUploadUrl(req, docType) {
        return this.deliveryService.getUploadUrl(req.user.userId, docType);
    }
    async confirmUpload(req, body) {
        return this.deliveryService.updateDocumentStatus(req.user.userId, body.docType, body.url);
    }
    async getStatus(req) {
        return this.deliveryService.getStatus(req.user.userId);
    }
    async updateVehicle(req, dto) {
        return this.deliveryService.updateVehicle(req.user.userId, dto);
    }
    async verifyPartner(partnerId, status) {
        return this.deliveryService.verifyPartner(partnerId, status);
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, common_1.Post)('payout/request'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Request payout' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payout requested' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { amount: { type: 'number' } } } }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "requestPayout", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('payouts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getPayoutHistory", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Post)('onboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit onboarding details' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Onboarding data submitted' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delivery_onboarding_dto_1.OnboardDeliveryPartnerDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "onboard", null);
__decorate([
    (0, common_1.Post)('documents/upload-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get S3 presigned URL for document upload' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Presigned URL returned' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { docType: { type: 'string', example: 'license_front' } } } }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('docType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getUploadUrl", null);
__decorate([
    (0, common_1.Post)('documents/confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm document upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document status updated' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { docType: { type: 'string' }, url: { type: 'string' } } } }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "confirmUpload", null);
__decorate([
    (0, common_1.Get)('onboarding-status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get onboarding status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current status' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Put)('vehicle-details'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle details updated' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delivery_onboarding_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateVehicle", null);
__decorate([
    (0, common_1.Put)(':partnerId/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify or Reject Partner (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partner status updated' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['VERIFIED', 'REJECTED'] } } } }),
    __param(0, (0, common_1.Param)('partnerId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.OnboardingStatus !== "undefined" && client_1.OnboardingStatus) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "verifyPartner", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, swagger_1.ApiTags)('Delivery'),
    (0, common_1.Controller)('delivery'),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService,
        earnings_service_1.EarningsService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map