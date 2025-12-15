import { Module, Global } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { GeocodingService } from './services/geocoding.service';

@Global()
@Module({
    providers: [S3Service, GeocodingService],
    exports: [S3Service, GeocodingService],
})
export class CommonModule { }
