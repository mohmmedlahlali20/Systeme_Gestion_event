import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuth } from '../guard/auth.guard';

@Controller('users')
@UseGuards(JwtAuth)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  

  @Get('All_User')
  findAll() {
    return this.usersService.findAll();
  }

 
}
