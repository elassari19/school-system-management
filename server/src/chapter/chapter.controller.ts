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
import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto, GetChapterDto } from './dto/chapter.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('chapters')
@Controller('chapter')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @ApiOperation({ summary: 'Get chapter by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Chapter found' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async getChapter(@Query() query: GetChapterDto) {
    return this.chapterService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @ApiOperation({ summary: 'Get all chapters' })
  @ApiResponse({ status: 200, description: 'List of chapters' })
  async getAllChapters(@Query() query: any) {
    return this.chapterService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count chapters' })
  @ApiResponse({ status: 200, description: 'Chapter count' })
  async countChapters(@Body() query: any) {
    return this.chapterService.count(query);
  }

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new chapter' })
  @ApiResponse({ status: 201, description: 'Chapter created successfully' })
  async createChapter(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Put()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update a chapter' })
  @ApiResponse({ status: 200, description: 'Chapter updated successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async updateChapter(@Body() body: UpdateChapterDto & { where: { id: string } }) {
    const { where, ...data } = body;
    return this.chapterService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Delete a chapter' })
  @ApiResponse({ status: 200, description: 'Chapter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async deleteChapter(@Body() body: { where: { id: string } }) {
    return this.chapterService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Delete many chapters' })
  @ApiResponse({ status: 200, description: 'Chapters deleted successfully' })
  async deleteManyChapters(@Body() body: { ids: string[] }) {
    return this.chapterService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all chapters' })
  @ApiResponse({ status: 200, description: 'All chapters deleted successfully' })
  async deleteAllChapters() {
    return this.chapterService.deleteAll();
  }
}