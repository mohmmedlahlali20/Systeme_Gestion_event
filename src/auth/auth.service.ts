import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  
  ) { }


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


  async login(email: string, password: string): Promise<string>{
    const user = await this.userModel.findOne({email})
    if(!email){
      throw { statusCode: 400, message: 'User with this email dosn\'t exists' };
    }
    const PasswordCompare = await bcrypt.compare(password, user.password)
    if (!PasswordCompare) {
      throw { statusCode: 400, message: 'Invalid Password' };
    }
    return this.jwtService.sign({ email: user.email, userId: user._id });

  }
  



}
