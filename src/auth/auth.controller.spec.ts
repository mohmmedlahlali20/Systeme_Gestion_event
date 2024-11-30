import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Role } from './dto/create-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const createAuthDto: CreateAuthDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.User,
    };
    const result = { message: 'User created successfully', user: { ...createAuthDto } };
    jest.spyOn(service, 'register').mockResolvedValue(result.user);

    expect(await controller.register(createAuthDto)).toEqual(result);
  });

  it('should login a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'mock-jwt-token';
    const user = {
      email,
      password,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.User,
    };
  
    jest.spyOn(service, 'login').mockResolvedValue({ token, user });
  
    expect(await controller.login(email, password)).toEqual({
      message: 'Login success',
      token: {
        token,
        user,
      },
    });
  });
  
  
});
