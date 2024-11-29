import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Role } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
 

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec(); 
  }


  
}
