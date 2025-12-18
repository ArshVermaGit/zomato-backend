import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;
    uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string>;
    uploadMultipleFiles(files: Express.Multer.File[], path: string): Promise<string[]>;
    deleteFile(fileUrl: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    getSignedUploadUrl(key: string): Promise<string>;
    getPublicUrl(key: string): string;
}
