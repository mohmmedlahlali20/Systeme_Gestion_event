import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ObjectId, Types } from 'mongoose';

const mockEventService = {
  create: jest.fn(),
  addMember: jest.fn(),
  remove: jest.fn(),
};

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        { provide: EventService, useValue: mockEventService },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto: CreateEventDto = {
        Title: 'Test Event',
        Description: 'Description for test event',
        Members: [],
      };

      mockEventService.create.mockResolvedValue({
        message: 'event created success',
        newEvent: createEventDto,
      });

      const result = await controller.create(createEventDto);
      expect(result).toEqual({
        message: 'event created success',
        newEvent: createEventDto,
      });
      expect(mockEventService.create).toHaveBeenCalledWith(createEventDto);
    });
  });

  describe('addNewUser', () => {
    it('should add a new member to an event', async () => {
      const eventId = new Types.ObjectId()
      const userId = new Types.ObjectId() 

      mockEventService.addMember.mockResolvedValue({
        message: 'Member added successfully',
        event: { members: [userId] },
      });

      const result = await controller.addNewUser({ userId, eventId });
      expect(result).toEqual({
        message: 'Member added successfully',
        event: { members: [userId] },
      });
      expect(mockEventService.addMember).toHaveBeenCalledWith(eventId, userId);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const eventId = new Types.ObjectId()
      mockEventService.remove.mockResolvedValue({
        message: 'Event deleted successfully',
        deletedEvent: { _id: eventId },
      });

      const result = await controller.remove(eventId.toString());
      expect(result).toEqual({
        message: 'Event deleted successfully',
        deletedEvent: { _id: eventId },
      });
      expect(mockEventService.remove).toHaveBeenCalledWith(eventId.toString());
    });
  });
});
