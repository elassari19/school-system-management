import { IsString, IsOptional, IsUUID, IsNumber, IsEnum, IsArray, IsNumberString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Level } from '../../common/entities/enums';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Mathematics' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn the basics of mathematics' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  instructor: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ enum: Level })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiPropertyOptional({ type: [String], example: ['math', 'basics'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  subjectId: string;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: 99.99 })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced Mathematics' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Learn advanced mathematics' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Jane Smith' })
  @IsOptional()
  @IsString()
  instructor?: string;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ enum: Level })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiPropertyOptional({ type: [String], example: ['math', 'advanced'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ example: 149.99 })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class GetCourseDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  id: string;
}