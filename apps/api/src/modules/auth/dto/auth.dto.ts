import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@payflow.ai' })
  @IsEmail()
  email!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@payflow.ai' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: '+919999999999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}