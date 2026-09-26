import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  getProfile: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      fullname: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should call authService.signUp and return result', async () => {
      const expectedResult = { id: '1', email: 'test@example.com', fullname: 'Test User' };
      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw ConflictException if passwords do not match', async () => {
      const invalidDto = { ...signUpDto, confirmPassword: 'different' };
      mockAuthService.signUp.mockRejectedValue(new ConflictException('Passwords do not match'));

      await expect(controller.signUp(invalidDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockAuthService.signUp.mockRejectedValue(new ConflictException('Email already exists'));

      await expect(controller.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should call authService.signIn and return result', async () => {
      const expectedResult = {
        user: { id: '1', email: 'test@example.com', fullname: 'Test User' },
        accessToken: 'mock-jwt-token',
      };
      mockAuthService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException('Invalid email or password'));

      await expect(controller.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = { email: 'test@example.com' };

    it('should call authService.forgotPassword and return result', async () => {
      const expectedResult = { message: 'Token sent to your email' };
      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthService.forgotPassword.mockRejectedValue(new UnauthorizedException('User not found'));

      await expect(controller.forgotPassword(forgotPasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      email: 'test@example.com',
      token: 'valid-token',
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    };

    it('should call authService.resetPassword and return result', async () => {
      const expectedResult = { message: 'Password reset successfully' };
      mockAuthService.resetPassword.mockResolvedValue(expectedResult);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockAuthService.resetPassword.mockRejectedValue(new UnauthorizedException('Invalid token'));

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ConflictException if passwords do not match', async () => {
      const invalidDto = { ...resetPasswordDto, confirmPassword: 'different' };
      mockAuthService.resetPassword.mockRejectedValue(new ConflictException('Passwords do not match'));

      await expect(controller.resetPassword(invalidDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile and return result', async () => {
      const req = { user: { sub: '123' } };
      const expectedResult = { id: '1', email: 'test@example.com', fullname: 'Test User' };
      mockAuthService.getProfile.mockResolvedValue(expectedResult);

      const result = await controller.getProfile(req);

      expect(authService.getProfile).toHaveBeenCalledWith('123');
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const req = { user: { sub: '123' } };
      mockAuthService.getProfile.mockRejectedValue(new UnauthorizedException('User not found'));

      await expect(controller.getProfile(req)).rejects.toThrow(UnauthorizedException);
    });
  });
});