import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';


@Controller('auth')

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() userDto: CreateAuthDto) {
    const newUser = await this.authService.register(userDto);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Post('/login')
async login(
  @Body('email') email: string,
  @Body('password') password: string,
) {
  const { token, user } = await this.authService.login(email, password);
  return { 
    message: 'Login success', 
    token: { token, user },
  };
}


}
