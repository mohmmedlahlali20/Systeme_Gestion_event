import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema,Event } from './schemas/event.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Event.name, schema: EventSchema }])
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
