import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, GetUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('users')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Query() query: GetUserDto) {
    return this.userService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count users' })
  @ApiResponse({ status: 200, description: 'User count' })
  async countUsers(@Body() query: any) {
    return this.userService.count(query);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Body() updateUserDto: UpdateUserDto & { where: { id: string } }) {
    const { where, ...data } = updateUserDto;
    return this.userService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Body() body: { where: { id: string } }) {
    return this.userService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete many users' })
  @ApiResponse({ status: 200, description: 'Users deleted successfully' })
  async deleteManyUsers(@Body() body: { ids: string[] }) {
    return this.userService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all users' })
  @ApiResponse({ status: 200, description: 'All users deleted successfully' })
  async deleteAllUsers() {
    return this.userService.deleteAll();
  }
}