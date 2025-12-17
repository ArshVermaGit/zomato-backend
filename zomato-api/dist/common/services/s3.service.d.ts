import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private s3Client;
    constructor(configService: ConfigService);
    getSignedUploadUrl(key: string, contentType?: string): Promise<string>;
    uploadFile(key: string, body: Buffer | string, contentType: string): Promise<string>;
    getPublicUrl(key: string): string;
}
