import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
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
      Date:'2024-11-30T10:00:00Z'
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

  // it('should remove an event', async () => {
  //   const eventId = new Types.ObjectId();

  //   const serviceRemoveSpy = jest.spyOn(service, 'remove').mockResolvedValue({
  //     message: 'Event deleted successfully',
  //   });

  //   const result = await controller.remove(eventId);
  //   expect(serviceRemoveSpy).toHaveBeenCalledWith(eventId);
  //   expect(result).toEqual({ message: 'Event deleted successfully' });
  // });
});