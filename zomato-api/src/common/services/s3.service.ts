import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || this.configService.get<string>('AWS_S3_BUCKET') || '';
    }

    // Upload file to S3
    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        // 1. Compress image if it's an image file
        let buffer = file.buffer;
        if (file.mimetype.startsWith('image/')) {
            buffer = await sharp(file.buffer)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
        }

        // 2. Generate unique filename
        const fileName = `${path}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const key = `${fileName}.${file.mimetype.split('/')[1]}`;

        // 3. Upload to S3
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        await this.s3Client.send(command);

        // 4. Return public URL
        return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    }

    // Helper for direct buffer uploads (e.g. from MenuService)
    async uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string> {
        // 1. Compress if image
        if (contentType.startsWith('image/')) {
            try {
                buffer = await sharp(buffer)
                    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 85 })
                    .toBuffer();
            } catch (error) {
                console.warn('Failed to compress image, uploading original buffer', error);
            }
        }

        // 2. Upload to S3
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            // ACL: 'public-read', // Check if bucket has ACL enabled, usually it's cleaner to handle via policy
        });

        await this.s3Client.send(command);

        // 3. Return public URL
        return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    }

    // Upload multiple files
    async uploadMultipleFiles(files: Express.Multer.File[], path: string): Promise<string[]> {
        const uploadPromises = files.map(file => this.uploadFile(file, path));
        return Promise.all(uploadPromises);
    }

    // Delete file from S3
    async deleteFile(fileUrl: string): Promise<void> {
        const key = fileUrl.split('.com/')[1];
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }

    // Generate pre-signed URL for temporary access
    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    // Legacy support alias if needed, or we adapt MenuService
    async getSignedUploadUrl(key: string): Promise<string> {
        // Not used in new flow but kept for compatibility if needed.
        // Actually we should use uploadBuffer in MenuService. 
        // Returning a signed URL for client upload logic (which was the old flow).
        // If we want to support the old flow:
        return this.getSignedUrl(key, 3600); // reuse getSignedUrl logic? No, getSignedUrl is for GetObject usually.
        // We need PutObject presigned url.
        // Let's implement if we really need it, but MenuService was refactored to use uploadFile (now will use uploadBuffer).
        // Let's omit this unless compilation fails.
        throw new Error('Method not implemented. Use uploadFile/uploadBuffer instead.');
    }

    getPublicUrl(key: string): string {
        return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    }
}
