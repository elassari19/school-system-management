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
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto, GetGroupDto } from './dto/group.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('groups')
@Controller('group')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Group found' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroup(@Query() query: GetGroupDto) {
    return this.groupService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'List of groups' })
  async getAllGroups(@Query() query: any) {
    return this.groupService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count groups' })
  @ApiResponse({ status: 200, description: 'Group count' })
  async countGroups(@Body() query: any) {
    return this.groupService.count(query);
  }

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Put()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async updateGroup(@Body() body: UpdateGroupDto & { where: { id: string } }) {
    const { where, ...data } = body;
    return this.groupService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async deleteGroup(@Body() body: { where: { id: string } }) {
    return this.groupService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete many groups' })
  @ApiResponse({ status: 200, description: 'Groups deleted successfully' })
  async deleteManyGroups(@Body() body: { ids: string[] }) {
    return this.groupService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all groups' })
  @ApiResponse({ status: 200, description: 'All groups deleted successfully' })
  async deleteAllGroups() {
    return this.groupService.deleteAll();
  }
}