import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto, Role } from './dto/create-auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with the correct data and return the expected result', async () => {
      const dto: CreateAuthDto = {
        email: 'luffy@gmail.com',
        password: 'luffy_luffy',
        firstName: 'luffy',
        lastName: 'monkey D',
        role: Role.User,
      };
      const expectedResult = { userId: '1', email: 'luffy@gmail.com' };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await authController.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult); 
    });
  });
});
