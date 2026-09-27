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
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto, GetEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('events')
@Controller('event')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventController {
  constructor(private eventService: EventService) {}

  @Get()
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Event found' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEvent(@Query() query: GetEventDto) {
    return this.eventService.findOne(query.id);
  }

  @Get('all')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'List of events' })
  async getAllEvents(@Query() query: any) {
    return this.eventService.findAll(query);
  }

  @Post('count')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Count events' })
  @ApiResponse({ status: 200, description: 'Event count' })
  async countEvents(@Body() query: any) {
    return this.eventService.count(query);
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Put()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async updateEvent(@Body() body: UpdateEventDto & { where: { id: string } }) {
    const { where, ...data } = body;
    return this.eventService.update(where.id, data);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async deleteEvent(@Body() body: { where: { id: string } }) {
    return this.eventService.delete(body.where.id);
  }

  @Delete('many')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete many events' })
  @ApiResponse({ status: 200, description: 'Events deleted successfully' })
  async deleteManyEvents(@Body() body: { ids: string[] }) {
    return this.eventService.deleteMany(body.ids);
  }

  @Delete('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete all events' })
  @ApiResponse({ status: 200, description: 'All events deleted successfully' })
  async deleteAllEvents() {
    return this.eventService.deleteAll();
  }
}
