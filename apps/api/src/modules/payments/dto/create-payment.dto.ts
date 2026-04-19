import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({ example: 'merchant_abc123' })
  @IsString()
  merchantId!: string;

  @ApiProperty({ example: 'Coffee', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}