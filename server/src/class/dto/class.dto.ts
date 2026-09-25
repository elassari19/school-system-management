import { IsString, IsOptional, IsArray, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Grade 10A' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: [String], example: ['uuid1', 'uuid2'] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userId?: string[];
}

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Grade 10B' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: [String], example: ['uuid1', 'uuid2'] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userId?: string[];
}

export class GetClassDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  id: string;
}