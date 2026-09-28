import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto, GetStudentDto } from './dto/student.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('students')
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER', 'PARENT')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudent(@Query() query: GetStudentDto) {
    return this.studentService.findOne(query.id);
  }

  @Get('me')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get the authenticated student own record (class + subjects)' })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getMyStudent(@Req() req: any) {
    return this.studentService.findMeByUserId(req.user.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'List of students' })
  async getAllStudents(@Query() query: any) {
    return this.studentService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count students' })
  @ApiResponse({ status: 200, description: 'Student count' })
  async countStudents(@Body() query: any) {
    return this.studentService.count(query);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Put()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async updateStudent(@Body() body: UpdateStudentDto & { id: string }) {
    const { id, ...data } = body;
    return this.studentService.update(id, data);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async deleteStudent(@Body() body: { id: string }) {
    return this.studentService.delete(body.id);
  }

  @Delete('many')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete many students' })
  @ApiResponse({ status: 200, description: 'Students deleted successfully' })
  async deleteManyStudents(@Body() body: { ids: string[] }) {
    return this.studentService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all students' })
  @ApiResponse({ status: 200, description: 'All students deleted successfully' })
  async deleteAllStudents() {
    return this.studentService.deleteAll();
  }
}