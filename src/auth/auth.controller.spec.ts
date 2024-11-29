import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller'; 
import { AuthService } from 'src/auth/auth.service'; 
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/users.schema';
import { Role } from 'src/auth/dto/create-auth.dto'; 


const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUserModel = {
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController], 
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController); 
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register and return a success message', async () => {
      const userDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        role: Role.User, 
      };

      const mockUser = {
        _id: 'mockUserId',
        firstName: userDto.firstName,
        email: userDto.email,
        password: 'hashedPassword',
        role: userDto.role,
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(userDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(userDto);
      expect(result).toEqual({
        message: 'User created successfully',
        user: mockUser,
      });
    });

    it('should throw an error if the user email already exists', async () => {
      const userDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        role: Role.User,
      };

      mockAuthService.register.mockRejectedValue(new Error('User with this email already exists'));

      await expect(controller.register(userDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return a token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mockJwtToken';

      mockAuthService.login.mockResolvedValue({ token: mockToken, user: {} });

      const result = await controller.login(loginDto.email, loginDto.password);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual({
        message: 'Login success',
        token: mockToken,
      });
    });

    it('should throw an error if the login fails', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto.email, loginDto.password)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
