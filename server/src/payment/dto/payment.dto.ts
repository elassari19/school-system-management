import { IsString, IsOptional, IsNumber, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 10000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'usd' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  userId: string;
}

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  userId: string;
}

export class RetrievePaymentDto {
  @ApiProperty({ example: 'pi_xxxxx' })
  @IsString()
  paymentId: string;
}

export class WebhookDto {
  @ApiProperty()
  @IsString()
  stripeSignature: string;
}