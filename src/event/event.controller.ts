import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuth } from '../guard/auth.guard'
import { ObjectId } from 'mongoose';

@Controller('event')
@UseGuards(JwtAuth)
export class EventController {
  constructor(private  eventService: EventService) { }

  @Post('create')
  create(@Body() createEventDto: CreateEventDto) {
    console.log('Received DTO:', createEventDto); 
    return this.eventService.create(createEventDto);
  }


  @Post('add_user')
  async addNewUser(@Body() body: { eventId: string; userIds: string[] }) {
    const { eventId, userIds } = body;
    console.log(userIds)
    return this.eventService.addMember(eventId, userIds);
  }

  @Get('getAllEvent')
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':eventId')
  findOne(@Param('eventId') eventId: string) {
    return this.eventService.findOne(eventId);
  }

  @Patch(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<any> {
    console.log(updateEventDto);
    
    return this.eventService.updateEvent(eventId, updateEventDto);
  }

  @Delete('remove/:eventId')
  async remove(@Param('eventId') eventId: ObjectId) {
    return this.eventService.remove(eventId); 
  }



  @Patch('remove/member/:eventId')
  async removeMember(@Param('eventId') eventId: string, @Body('userId') userId: string) {
    return this.eventService.removeMemberFromEvent(userId, eventId);
  }

  @Get('eventsUser/:userId')
  async getAllEventsByUserId(@Param('userId') userId: string) {
    return this.eventService.getEventByUserId(userId);
  }

  
}
