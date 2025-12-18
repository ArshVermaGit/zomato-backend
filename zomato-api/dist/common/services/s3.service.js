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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
const sharp_1 = __importDefault(require("sharp"));
let S3Service = class S3Service {
    configService;
    s3Client;
    bucketName;
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME') || this.configService.get('AWS_S3_BUCKET') || '';
    }
    async uploadFile(file, path) {
        let buffer = file.buffer;
        if (file.mimetype.startsWith('image/')) {
            buffer = await (0, sharp_1.default)(file.buffer)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
        }
        const fileName = `${path}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const key = `${fileName}.${file.mimetype.split('/')[1]}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });
        await this.s3Client.send(command);
        return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    }
    async uploadBuffer(key, buffer, contentType) {
        if (contentType.startsWith('image/')) {
            try {
                buffer = await (0, sharp_1.default)(buffer)
                    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 85 })
                    .toBuffer();
            }
            catch (error) {
                console.warn('Failed to compress image, uploading original buffer', error);
            }
        }
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        });
        await this.s3Client.send(command);
        return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    }
    async uploadMultipleFiles(files, path) {
        const uploadPromises = files.map(file => this.uploadFile(file, path));
        return Promise.all(uploadPromises);
    }
    async deleteFile(fileUrl) {
        const key = fileUrl.split('.com/')[1];
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }
    async getSignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    async getSignedUploadUrl(key) {
        return this.getSignedUrl(key, 3600);
        throw new Error('Method not implemented. Use uploadFile/uploadBuffer instead.');
    }
    getPublicUrl(key) {
        return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map