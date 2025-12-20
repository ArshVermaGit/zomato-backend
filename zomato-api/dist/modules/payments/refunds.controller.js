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
exports.RefundsController = void 0;
const common_1 = require("@nestjs/common");
const refunds_service_1 = require("./refunds.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let RefundsController = class RefundsController {
    refundsService;
    constructor(refundsService) {
        this.refundsService = refundsService;
    }
    async calculateRefund(orderId) {
        return this.refundsService.calculateRefund(orderId);
    }
    async processRefund(orderId, type, reason) {
        return this.refundsService.processRefund(orderId, type, reason);
    }
};
exports.RefundsController = RefundsController;
__decorate([
    (0, common_1.Get)(':orderId/calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate Potential Refund' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Refund calculation details',
        schema: {
            example: { refundableAmount: 450, policy: 'Standard: 100% refund' },
        },
    }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RefundsController.prototype, "calculateRefund", null);
__decorate([
    (0, common_1.Post)(':orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Refund' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Refund processed successfully' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string', enum: ['GATEWAY', 'WALLET'] },
                reason: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('type')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RefundsController.prototype, "processRefund", null);
exports.RefundsController = RefundsController = __decorate([
    (0, swagger_1.ApiTags)('Refunds'),
    (0, common_1.Controller)('payments/refunds'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [refunds_service_1.RefundsService])
], RefundsController);
//# sourceMappingURL=refunds.controller.js.map