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

@Controller('event')
//@UseGuards(JwtAuth)
export class EventController {
  constructor(private  eventService: EventService) { }

  @Post('create')
  create(@Body() createEventDto: CreateEventDto) {
    console.log('Received DTO:', createEventDto); 
    return this.eventService.create(createEventDto);
  }

  // @Get()
  // findAll() {
  //   return this.eventService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventService.remove(+id);
  // }
}
