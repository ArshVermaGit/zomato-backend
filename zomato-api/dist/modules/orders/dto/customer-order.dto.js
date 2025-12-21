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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRatingDto = exports.OrderFilterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class OrderFilterDto {
    status;
    page = 1;
    limit = 10;
}
exports.OrderFilterDto = OrderFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OrderStatus, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus),
    __metadata("design:type", typeof (_a = typeof client_1.OrderStatus !== "undefined" && client_1.OrderStatus) === "function" ? _a : Object)
], OrderFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderFilterDto.prototype, "limit", void 0);
class CreateRatingDto {
    rating;
    comment;
    deliveryRating;
    tags;
}
exports.CreateRatingDto = CreateRatingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRatingDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRatingDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateRatingDto.prototype, "deliveryRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRatingDto.prototype, "tags", void 0);
//# sourceMappingURL=customer-order.dto.js.map