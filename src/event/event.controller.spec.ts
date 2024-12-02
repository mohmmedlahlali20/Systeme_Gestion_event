import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Types } from 'mongoose';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
            addMember: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateEvent: jest.fn(),
            removeMemberFromEvent: jest.fn(),
            getEventByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should create an event', async () => {
    const dto: CreateEventDto = {
      Title: 'Event Title',
      Description: 'Event Description',
      Members: ['memberId1', 'memberId2'],
      location: 'Event Location',
      Date: '2024-11-30T10:00:00Z',
    };

    const serviceCreateSpy = jest.spyOn(service, 'create').mockResolvedValue({
      message: 'Event created successfully',
      newEvent: dto,
    });

    const result = await controller.create(dto);
    expect(serviceCreateSpy).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      message: 'Event created successfully',
      newEvent: dto,
    });
  });

  it('should remove an event', async () => {
    const eventId = '1236';

    const serviceRemoveSpy = jest.spyOn(service, 'remove').mockResolvedValue({
      message: 'Event deleted successfully',
    });

    const result = await controller.remove(eventId);
    expect(serviceRemoveSpy).toHaveBeenCalledWith(eventId);
    expect(result).toEqual({ message: 'Event deleted successfully' });
  });

  it('should update an event', async () => {
    const eventId = '1234';
    const updateDto: UpdateEventDto = {
      Title: 'Updated Event Title',
      Description: 'Updated Event Description',
      Members: ['memberId1'],
      location: 'Updated Location',
      Date: '2024-12-01T12:00:00Z',
    };

    const serviceUpdateSpy = jest.spyOn(service, 'updateEvent').mockResolvedValue({
      message: 'Event updated successfully',
      updatedEvent: updateDto,
    });

    const result = await controller.updateEvent(eventId, updateDto);
    expect(serviceUpdateSpy).toHaveBeenCalledWith(eventId, updateDto);
    expect(result).toEqual({
      message: 'Event updated successfully',
      updatedEvent: updateDto,
    });
  });

  it('should add members to an event', async () => {
    const eventId = '1234';
    const userIds = ['userId1', 'userId2'];

    const serviceAddMemberSpy = jest.spyOn(service, 'addMember').mockResolvedValue({
      message: 'Members added successfully',
    });

    const result = await controller.addNewUser({ eventId, userIds });
    expect(serviceAddMemberSpy).toHaveBeenCalledWith(eventId, userIds);
    expect(result).toEqual({ message: 'Members added successfully' });
  });

  it('should get all events', async () => {
    const events = [
      {
        Title: 'Event 1',
        Description: 'Description 1',
        location: 'Location 1',
        members: [],
        Date: '2024-12-01T10:00:00Z',
      },
      {
        Title: 'Event 2',
        Description: 'Description 2',
        location: 'Location 2',
        members: [],
        Date: '2024-12-02T10:00:00Z',
      },
    ];

    const serviceFindAllSpy = jest.spyOn(service, 'findAll').mockResolvedValue(events);

    const result = await controller.findAll();
    expect(serviceFindAllSpy).toHaveBeenCalled();
    expect(result).toEqual(events);
  });

  it('should get an event by ID', async () => {
    const eventId = '1234';
    const event = {
      Title: 'Event 1',
      Description: 'Description 1',
      members: [],
      location: 'Location 1',
      Date: '2024-12-01T10:00:00Z',
    };

    const serviceFindOneSpy = jest.spyOn(service, 'findOne').mockResolvedValue(event);

    const result = await controller.findOne(eventId);
    expect(serviceFindOneSpy).toHaveBeenCalledWith(eventId);
    expect(result).toEqual(event);
  });

  it('should remove a member from an event', async () => {
    const eventId = '1234';
    const userId = 'userId1';

    const serviceRemoveMemberSpy = jest.spyOn(service, 'removeMemberFromEvent').mockResolvedValue({
      message: 'Member removed successfully',
    });

    const result = await controller.removeMember(eventId, userId);
    expect(serviceRemoveMemberSpy).toHaveBeenCalledWith(userId, eventId);
    expect(result).toEqual({ message: 'Member removed successfully' });
  });

  it('should get all events for a user', async () => {
    const userId = 'userId1';
    const events = [
      {
        Title: 'Event 1',
        Description: 'Description 1',
        location: 'Location 1',
        members: [],
        Date: '2024-12-01T10:00:00Z',
      },
    ];

    const serviceGetEventsByUserSpy = jest.spyOn(service, 'getEventByUserId').mockResolvedValue(events);

    const result = await controller.getAllEventsByUserId(userId);
    expect(serviceGetEventsByUserSpy).toHaveBeenCalledWith(userId);
    expect(result).toEqual(events);
  });
});
