import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderDto {
    @ApiProperty({ example: 'Customer called to cancel' })
    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class AssignDeliveryPartnerDto {
    @ApiProperty({ example: 'partner-uuid' })
    @IsNotEmpty()
    @IsUUID()
    deliveryPartnerId: string;
}
