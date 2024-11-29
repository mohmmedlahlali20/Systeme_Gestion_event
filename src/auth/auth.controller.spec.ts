import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';

import { User } from '../users/schemas/users.schema';
import { Role } from './dto/create-auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserModel: any;

  const mockUser = {
    _id: 'mockUserId',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
  };

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should create a new user if email is not taken', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(mockUser);

    const userDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      role: Role.User,
    };

    const result = await authService.register(userDto);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: userDto.email });
    expect(mockUserModel.create).toHaveBeenCalledWith(expect.objectContaining({
      firstName: userDto.firstName,
      email: userDto.email,
    }));
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if email is already taken', async () => {
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const userDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      role: Role.User,
    };

    await expect(authService.register(userDto)).rejects.toThrow('User with this email already exists');
  });
});
