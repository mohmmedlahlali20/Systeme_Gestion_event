import { Injectable } from '@nestjs/common';
import { CreateAuthDto, Role } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/users.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,

  ) { }


  async register(userDto: CreateAuthDto): Promise<any> {
    const { firstName, lastName, email, password, role } = userDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || Role.User;
    const CreateUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password:hashedPassword ,
      role: userRole,
    });

    return  CreateUser.save();

  }


  async login(email: string, password: string): Promise<{ token: string, user: User }> {
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new Error('User with this email doesn\'t exist');
    }
    
    if (!email) {
      throw { statusCode: 400, message: 'User with this email dosn\'t exists' };
    }
    const PasswordCompare = await bcrypt.compare(password, user.password)
    if (!PasswordCompare) {
      throw { statusCode: 400, message: 'Invalid Password' };
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'superKeyScurize',
    );
    return { token: token, user: user };

  }




}
