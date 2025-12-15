import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
    }

    async getSignedUploadUrl(key: string, contentType: string = 'image/jpeg'): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key,
            ContentType: contentType,
        });
        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    async uploadFile(key: string, body: Buffer | string, contentType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: key,
            Body: body,
            ContentType: contentType,
        });
        await this.s3Client.send(command);
        return this.getPublicUrl(key);
    }

    getPublicUrl(key: string): string {
        const bucket = this.configService.get('AWS_S3_BUCKET_NAME');
        const region = this.configService.get('AWS_REGION');
        return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }
}
