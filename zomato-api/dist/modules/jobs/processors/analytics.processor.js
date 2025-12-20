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
var AnalyticsJobsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsJobsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("../../analytics/analytics.service");
let AnalyticsJobsProcessor = AnalyticsJobsProcessor_1 = class AnalyticsJobsProcessor {
    analyticsService;
    logger = new common_1.Logger(AnalyticsJobsProcessor_1.name);
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    calculateDailyMetrics(_job) {
        this.logger.log('Calculating Daily Analytics Metrics...');
    }
};
exports.AnalyticsJobsProcessor = AnalyticsJobsProcessor;
__decorate([
    (0, bull_1.Process)('calculateDailyMetrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsJobsProcessor.prototype, "calculateDailyMetrics", null);
exports.AnalyticsJobsProcessor = AnalyticsJobsProcessor = AnalyticsJobsProcessor_1 = __decorate([
    (0, bull_1.Processor)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsJobsProcessor);
//# sourceMappingURL=analytics.processor.js.map