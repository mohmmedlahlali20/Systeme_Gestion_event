import { Model } from "mongoose";
import { Event } from "./entities/event.entity";
import { getModelToken } from "@nestjs/mongoose";
import { EventService } from "./event.service";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

describe('EventService', () => {
  let eventService: EventService;
  let model: Model<Event>;

  const mockEvent = {
    _id: "674c406cc15a3175b4b5e354",
    Title: "evints",
    Description: 'Events is here',
    Date: "2024-12-15T00:00:00.000Z",
    location: "ertyui",
    members: [
      { _id: "6745c7a9882d90fe50c41a71", firstName: "Mohamed",lastName:"test", email: "pofamyrywe@mailvbnhinator.com", role: "User" },
      { _id: "6745ee021accaf64fc50f438", firstName: "Mohaamed",lastName:"test", email: "gfdh@jskqovP", role: "User" }
    ],
    createdAt: "2024-12-01T10:54:36.875Z",
    updatedAt: "2024-12-01T11:00:34.589Z",
    __v: 0
  };

  const mockQuery = {
    populate: jest.fn().mockReturnThis(), 
    exec: jest.fn().mockResolvedValue(mockEvent), 
  };

  const mockModel = {
    findById: jest.fn().mockReturnValue(mockQuery), 
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn().mockReturnValue(mockQuery)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  describe('getEventById', () => {
    it('should return an event with populated fields by its id', async () => {
      const result = await eventService.findOne(mockEvent._id);
  
      expect(mockModel.findById).toHaveBeenCalledWith(mockEvent._id);
      expect(mockQuery.populate).toHaveBeenCalledWith({ path: 'participants', model: 'User' });
      expect(mockQuery.populate).toHaveBeenCalledWith('owner');
      expect(result).toEqual(mockEvent);
    });
  
    it('should throw a NotFoundException if the event is not found', async () => {
      const mockQuery = { populate: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(null) };
    
      mockModel.findById.mockReturnValue(mockQuery);
    
      await expect(eventService.findOne('nonexistentId')).rejects.toThrowError(NotFoundException);
    
      expect(mockModel.findById).toHaveBeenCalledWith('nonexistentId');
      expect(mockQuery.populate).toHaveBeenCalledWith({ path: 'participants', model: 'User' });
      expect(mockQuery.populate).toHaveBeenCalledWith('owner');
    });
  });

  describe('createEvent', () => {
    it('should create an event and return it', async () => {
      const createEventDto: CreateEventDto = {
        Title: 'New Event',
        Description: 'Events is here',
        Date: '12-22-2033',
        location: 'dfghj',
        Members: ['user1', 'user2'],
      };
  
      const mockEvent = {
        _id: 'mockEventId',
        ...createEventDto,
      };
  
      mockModel.create.mockResolvedValue(mockEvent);
      const result = await eventService.create(createEventDto);
  
      expect(mockModel.create).toHaveBeenCalledWith(createEventDto);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update an event and return the updated event', async () => {
      const existingEvent = {
        _id: 'existingEventId',
        Title: 'Old Event',
        Members: ['user1'],
      };
  
      const updateEventDto: UpdateEventDto = {
        Title: 'Updated Event',
        Members: ['user2'],
      };
  
      const updatedEvent = {
        ...existingEvent,
        ...updateEventDto,
        Members: ['user1', 'user2'], 
      };
  
      mockModel.findById.mockResolvedValue(existingEvent); 
      mockModel.findByIdAndUpdate.mockResolvedValue(updatedEvent); 
  
      const result = await eventService.updateEvent('existingEventId', updateEventDto);
  
      expect(mockModel.findById).toHaveBeenCalledWith('existingEventId');
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'existingEventId',
        { $set: updateEventDto },
        { new: true }
      );
  
      expect(result).toEqual(updatedEvent);
    });
  
    it('should throw a NotFoundException if the event is not found', async () => {
      mockModel.findById.mockResolvedValue(null); 
  
      await expect(eventService.updateEvent('nonexistentEventId', {})).rejects.toThrowError(NotFoundException);
  
      expect(mockModel.findById).toHaveBeenCalledWith('nonexistentEventId');
    });
  });

  describe('removeEvent', () => {
    // it('should delete an event and return the deleted event', async () => {
    //   const eventToRemove = {
    //     _id: 'eventToDeleteId',
    //     title: 'Event to be deleted',
    //     participants: ['user1'],
    //     owner: 'user1',
    //   };
  
    //   mockModel.findByIdAndDelete.mockResolvedValue(eventToRemove); 
  
    //   const result = await eventService.remove('eventToDeleteId');
  
    //   expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('eventToDeleteId');
    //   expect(result).toEqual(eventToRemove);
    // });
  
    // it('should not delete an event and return null if the event is not found', async () => {
    //   mockModel.findByIdAndDelete.mockResolvedValue(null);
  
    //   const result = await eventService.remove('nonexistentEventId');
  
    //   expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('nonexistentEventId');
    //   expect(result).toBeNull();
    // });
  });

  describe('removeParticipant', () => {
    it('should remove a participant from an event', async () => {
      const eventWithParticipant = {
        _id: 'eventId',
        title: 'Sample Event',
        Members: ['participantId1', 'participantId2'],
      };
  
      mockModel.findById.mockResolvedValue(eventWithParticipant); 
      mockModel.findByIdAndUpdate.mockResolvedValue({
        ...eventWithParticipant,
        participants: ['participantId2'], 
      });
  
      const result = await eventService.removeMemberFromEvent('eventId', 'participantId1');
  
      expect(mockModel.findById).toHaveBeenCalledWith('eventId');
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: 'eventId' },
        { $pull: { participants: 'participantId1' } },
        { new: true }
      );
      expect(result.participants).toEqual(['participantId2']);
    });
  
    it('should throw an error if the event is not found', async () => {
      mockModel.findById.mockResolvedValue(null);
  
      await expect(eventService.removeMemberFromEvent('nonexistentEventId', 'participantId1')).rejects.toThrowError('Event not found');
      expect(mockModel.findById).toHaveBeenCalledWith('nonexistentEventId');
    });
  
    it('should throw an error if the participant is not found in the event', async () => {
      const eventWithoutParticipant = {
        _id: 'eventId',
        title: 'Sample Event',
        participants: ['participantId2'],
        owner: 'ownerId',
      };
  
      mockModel.findById.mockResolvedValue(eventWithoutParticipant); 
      await expect(eventService.removeMemberFromEvent('eventId', 'participantId1')).rejects.toThrowError('Participant not found in event');
      expect(mockModel.findById).toHaveBeenCalledWith('eventId');
    });
  });
  
//   describe('getAllEvents', () => {
//     it('should return events for the given owner with populated fields', async () => {
//       const mockEvents = [
//         { _id: 'eventId1', title: 'Event 1', owner: 'ownerId', participants: ['participantId1', 'participantId2'] },
//         { _id: 'eventId2', title: 'Event 2', owner: 'ownerId', participants: ['participantId1', 'participantId3'] },
//       ];
//       mockModel.find.mockResolvedValue(mockEvents); 
  
//       const result = await eventService.findAll('ownerId');
  
//       expect(mockModel.find).toHaveBeenCalledWith({ owner: 'ownerId' });
//       expect(result).toEqual(mockEvents);
//     });
  
//     it('should return an empty array if no events are found', async () => {
//       mockModel.find.mockResolvedValue([]); 
  
//       const result = await eventService.findAll('ownerId');
  
//       expect(mockModel.find).toHaveBeenCalledWith({ owner: 'ownerId' });
//       expect(result).toEqual([]);
//     });
//   });
});
