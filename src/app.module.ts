import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from "@nestjs/mongoose";
import { EventModule } from './event/event.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.Mongo_URI || 'mongodb://localhost:27017/systeme_gestion_event'),
    AuthModule, 
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
