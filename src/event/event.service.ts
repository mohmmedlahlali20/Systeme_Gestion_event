import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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


  async addMember(eventId: ObjectId, userId: ObjectId): Promise<any> {
    const event = await this.eventModel.findById(eventId);
  
    if (!event) {
      throw new Error('Event not found'); 
    }
  
    if (event.members.includes(userId)) {
      return {
        message: 'User is already a member of the event',
      };
    }
      event.members.push(userId);
      await event.save();
  
    return {
      message: 'Member added successfully',
      event,
    };
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

  async remove(eventId: ObjectId): Promise<any> {
    const deletedEvent = await this.eventModel.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      throw new Error('Event not found');
    }
    return {
      message: 'Event deleted successfully',
      deletedEvent,
    };
  }
}
