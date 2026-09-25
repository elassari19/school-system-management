import { IsString, IsOptional, IsUUID, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '../../common/entities/enums';

export class CreateContentDto {
  @ApiProperty({ enum: ContentType, example: ContentType.VIDEO })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty({ example: 'Introduction Video' })
  @IsString()
  title: string;

  @ApiProperty({ example: { url: 'https://example.com/video.mp4', duration: 600 } })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  chapterId: string;
}

export class UpdateContentDto {
  @ApiPropertyOptional({ enum: ContentType })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ example: 'Advanced Introduction Video' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: { url: 'https://example.com/video.mp4', duration: 900 } })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID()
  chapterId?: string;
}

export class GetContentDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  id: string;
}