import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto, GetContentDto } from './dto/content.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('contents')
@Controller('content')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Content found' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getContent(@Query() query: GetContentDto) {
    return this.contentService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @ApiOperation({ summary: 'Get all contents' })
  @ApiResponse({ status: 200, description: 'List of contents' })
  async getAllContents(@Query() query: any) {
    return this.contentService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count contents' })
  @ApiResponse({ status: 200, description: 'Content count' })
  async countContents(@Body() query: any) {
    return this.contentService.count(query);
  }

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  async createContent(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Put()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update a content' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async updateContent(@Body() body: UpdateContentDto & { where: { id: string } }) {
    const { where, ...data } = body;
    return this.contentService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Delete a content' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async deleteContent(@Body() body: { where: { id: string } }) {
    return this.contentService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Delete many contents' })
  @ApiResponse({ status: 200, description: 'Contents deleted successfully' })
  async deleteManyContents(@Body() body: { ids: string[] }) {
    return this.contentService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all contents' })
  @ApiResponse({ status: 200, description: 'All contents deleted successfully' })
  async deleteAllContents() {
    return this.contentService.deleteAll();
  }
}