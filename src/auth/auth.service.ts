import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }


  async register(userDto: CreateAuthDto): Promise<{ userId: any; email: string;  }> {
    const { firstName, lastName, email, password, role } = userDto;
  
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw { statusCode: 400, message: 'User with this email already exists' };
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'user';
  
    const CreateUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
    });
  
    const User = await CreateUser.save();
    return { userId: User._id, email: User.email };
  }
  



}
