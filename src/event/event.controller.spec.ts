import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Types } from 'mongoose';
import { EventController } from './event.controller';

const mockEventService = {
  create: jest.fn(),
  addMember: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateEvent: jest.fn(),
  remove: jest.fn(),
  removeMemberFromEvent: jest.fn(),
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
    it('should call EventService.create with the correct DTO', async () => {
      const Dto: CreateEventDto = { Title: 'Test Event', Date: new Date(), Description: 'test description', location: 'norva', Members: ['852', '896'] };
      await controller.create(Dto);

      expect(service.create).toHaveBeenCalledWith(Dto);
    });
  });

  describe('addNewUser', () => {
    it('should call EventService.addMember with correct parameters', async () => {
      const eventId = new Types.ObjectId();
      const userIds = [new Types.ObjectId(), new Types.ObjectId()];
      const body = { eventId, userIds };

      await controller.addNewUser(body);

      expect(service.addMember).toHaveBeenCalledWith(eventId, userIds);
    });
  });

  describe('findAll', () => {
    it('should call EventService.findAll', async () => {
      await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call EventService.findOne with correct eventId', async () => {
      const eventId = '12345';
      await controller.findOne(eventId);

      expect(service.findOne).toHaveBeenCalledWith(eventId);
    });
  });

  describe('updateEvent', () => {
    it('should call EventService.updateEvent with correct parameters', async () => {
      const eventId = '12345';
      const updateEventDto = { Title: 'Updated Event' };

      await controller.updateEvent(eventId, updateEventDto);

      expect(service.updateEvent).toHaveBeenCalledWith(eventId, updateEventDto);
    });
  });

  describe('remove', () => {
    it('should call EventService.remove with correct eventId', async () => {
      const eventId = new Types.ObjectId();

      await controller.remove(eventId);

      expect(service.remove).toHaveBeenCalledWith(eventId);
    });
  });

  describe('removeMember', () => {
    it('should call EventService.removeMemberFromEvent with correct parameters', async () => {
      const eventId = '12345';
      const userId = '67890';

      await controller.removeMember(eventId, userId);

      expect(service.removeMemberFromEvent).toHaveBeenCalledWith(userId, eventId);
    });
  });
});
