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
import { SubjectService } from './subject.service';
import { CreateSubjectDto, UpdateSubjectDto, GetSubjectDto } from './dto/subject.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('subjects')
@Controller('subject')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get subject by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Subject found' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async getSubject(@Query() query: GetSubjectDto) {
    return this.subjectService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'List of subjects' })
  async getAllSubjects(@Query() query: any) {
    return this.subjectService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count subjects' })
  @ApiResponse({ status: 200, description: 'Subject count' })
  async countSubjects(@Body() query: any) {
    return this.subjectService.count(query);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({ status: 201, description: 'Subject created successfully' })
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Put()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a subject' })
  @ApiResponse({ status: 200, description: 'Subject updated successfully' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async updateSubject(@Body() body: UpdateSubjectDto & { where: { id: string } }) {
    const { where, ...data } = body;
    return this.subjectService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiResponse({ status: 200, description: 'Subject deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async deleteSubject(@Body() body: { where: { id: string } }) {
    return this.subjectService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete many subjects' })
  @ApiResponse({ status: 200, description: 'Subjects deleted successfully' })
  async deleteManySubjects(@Body() body: { ids: string[] }) {
    return this.subjectService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all subjects' })
  @ApiResponse({ status: 200, description: 'All subjects deleted successfully' })
  async deleteAllSubjects() {
    return this.subjectService.deleteAll();
  }
}