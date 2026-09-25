import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({ example: 'Chapter 1: Introduction' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Introduction to the course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  courseId: string;
}

export class UpdateChapterDto {
  @ApiPropertyOptional({ example: 'Chapter 1: Advanced Introduction' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Advanced introduction to the course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID()
  courseId?: string;
}

export class GetChapterDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  id: string;
}