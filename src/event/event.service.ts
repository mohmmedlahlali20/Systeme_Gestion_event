import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { eventDocument, Event } from './schemas/event.schema';

@Injectable()
export class EventService {

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<eventDocument>,

  ) { }





  async create(createEventDto: CreateEventDto): Promise<any> {
    const { Title, Description, Members, location, Date } = createEventDto;
  
    const createEvent = new this.eventModel({
      Title,
      Description,
      Members,
      location,
      Date 
    });
  
    const newEvent = await createEvent.save();
    return {
      message: "Event created successfully",
      newEvent
    };
  }
  
  


  async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<any> {
    const event = await this.eventModel.findByIdAndUpdate(eventId, updateEventDto, {
      new: true,
    });
    return event;
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


  async removeMemberFromEvent(userId: string, eventId: string): Promise<any> {
    const event = await this.eventModel.findById(eventId);
  
    if (!event) {
      return { message: `No event found with id: ${eventId}` };
    }
  
    const userObjectId = new Types.ObjectId(userId);
  
    event.members = event.members.filter(member => member.toString() !== userObjectId.toString());
  
    await event.save();
  
    return { message: `User with id: ${userId} removed from event.` };
  }
  
  


  async findAll(): Promise<Event[]> {

    const evnets = await this.eventModel.find().populate('members')
    if (evnets.length === 0) {
      console.log("No events found");
      return [];
    }
    return evnets
  }

  async findOne(eventId: string): Promise<Event> {
    const eventById = await this.eventModel.findById(eventId).populate('members');
    if (!eventById) {
      throw new Error(`No event found with id: ${eventId}`);
    }
    return eventById;
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
