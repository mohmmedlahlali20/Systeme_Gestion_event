import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { eventDocument, Event } from './schemas/event.schema';

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<eventDocument>,

  ) { }





  async create(createEventDto: CreateEventDto): Promise<any>  {
    const { Title, Description, Members } = createEventDto
    const createEvent = new this.eventModel({
      Title,
      Description,
      Members,
    })
    const newEvent = await createEvent.save();
    return {
      message: "event created success",
      newEvent
    }
  }


  
  

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
