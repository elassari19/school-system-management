import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../common/entities/user.entity';
import { RedisService } from '../common/redis/redis.service';
import { SignUpDto, SignInDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  fullname: 'Test User',
  password: 'hashedPassword',
  role: 'PARENT',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockRedisService = {
  getCache: jest.fn(),
  setCache: jest.fn(),
  clearCache: jest.fn(),
  clearCachePattern: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);

    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      fullname: 'Test User',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should create a new user and return user without password', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.signUp(signUpDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: signUpDto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 12);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: signUpDto.email,
        fullname: signUpDto.fullname,
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('course:*');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(signUpDto.email);
    });

    it('should throw ConflictException if passwords do not match', async () => {
      const invalidDto = { ...signUpDto, confirmPassword: 'different' };

      await expect(service.signUp(invalidDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return user and access token on successful sign in', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');
      mockRedisService.getCache.mockResolvedValue(null);

      const result = await service.signIn(signInDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: signInDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(signInDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        user: { ...mockUser, password: undefined },
        accessToken: 'mock-jwt-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockRedisService.getCache.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      mockRedisService.getCache.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(redisService.getCache).toHaveBeenCalledWith('user:test@example.com');
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(redisService.setCache).toHaveBeenCalledWith('user:test@example.com', mockUser, 60);
      expect(result).toEqual(mockUser);
    });

    it('should return cached user if available', async () => {
      mockRedisService.getCache.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });
  });

  // Direct test to verify bcrypt mock works
  describe('bcrypt mock verification', () => {
    it('should have bcrypt.compare mocked', async () => {
      const result = await bcrypt.compare('any', 'any');
      expect(result).toBe(true);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = { email: 'test@example.com' };

    it('should generate reset token and store in redis', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: forgotPasswordDto.email } });
      expect(redisService.setCache).toHaveBeenCalledWith(
        `reset-password:${forgotPasswordDto.email}`,
        expect.any(String),
        60 * 60,
      );
      expect(result).toEqual({ message: 'Token sent to your email' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      email: 'test@example.com',
      token: 'valid-token',
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    };

    it('should reset password and clear reset token', async () => {
      mockRedisService.getCache.mockResolvedValue('valid-token');
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.resetPassword(resetPasswordDto);

      expect(redisService.getCache).toHaveBeenCalledWith(`reset-password:${resetPasswordDto.email}`);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: resetPasswordDto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(resetPasswordDto.password, 12);
      expect(userRepository.update).toHaveBeenCalledWith(
        { email: resetPasswordDto.email },
        { password: 'hashedPassword' },
      );
      expect(redisService.clearCache).toHaveBeenCalledWith(`reset-password:${resetPasswordDto.email}`);
      expect(result).toEqual({ message: 'Password reset successfully' });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockRedisService.getCache.mockResolvedValue('different-token');

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ConflictException if passwords do not match', async () => {
      const invalidDto = { ...resetPasswordDto, confirmPassword: 'different' };
      mockRedisService.getCache.mockResolvedValue('valid-token');

      await expect(service.resetPassword(invalidDto)).rejects.toThrow(ConflictException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockRedisService.getCache.mockResolvedValue('valid-token');
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(mockUser.id)).rejects.toThrow(UnauthorizedException);
    });
  });
});