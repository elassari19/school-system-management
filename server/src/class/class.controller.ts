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
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto, GetClassDto } from './dto/class.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('classes')
@Controller('class')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Class found' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async getClass(@Query() query: GetClassDto) {
    return this.classService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'List of classes' })
  async getAllClasses(@Query() query: any) {
    return this.classService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count classes' })
  @ApiResponse({ status: 200, description: 'Class count' })
  async countClass(@Body() query: any) {
    return this.classService.count(query);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  async createClass(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Put()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async updateClass(@Body() body: UpdateClassDto & { where: { id: string } }) {
    const { where, ...data } = body;
    return this.classService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a class' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async deleteClass(@Body() body: { where: { id: string } }) {
    return this.classService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete many classes' })
  @ApiResponse({ status: 200, description: 'Classes deleted successfully' })
  async deleteManyClasses(@Body() body: { ids: string[] }) {
    return this.classService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all classes' })
  @ApiResponse({ status: 200, description: 'All classes deleted successfully' })
  async deleteAllClasses() {
    return this.classService.deleteAll();
  }
}