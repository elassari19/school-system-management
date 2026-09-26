import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '../common/entities/user.entity';
import { RedisService } from '../common/redis/redis.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

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
  find: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
};

const mockRedisService = {
  getCache: jest.fn(),
  setCache: jest.fn(),
  clearCachePattern: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    redisService = module.get<RedisService>(RedisService);

    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return cached user if available', async () => {
      mockRedisService.getCache.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(redisService.getCache).toHaveBeenCalledWith(`user:${mockUser.id}`);
      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should fetch from database and cache if not cached', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(redisService.getCache).toHaveBeenCalledWith(`user:${mockUser.id}`);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(redisService.setCache).toHaveBeenCalledWith(`user:${mockUser.id}`, mockUser, 60);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return cached users if available', async () => {
      const users = [mockUser];
      mockRedisService.getCache.mockResolvedValue(users);

      const result = await service.findAll();

      expect(redisService.getCache).toHaveBeenCalledWith('user:all:{}');
      expect(userRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should fetch from database and cache if not cached', async () => {
      const users = [mockUser];
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(redisService.getCache).toHaveBeenCalledWith('user:all:{}');
      expect(userRepository.find).toHaveBeenCalledWith({});
      expect(redisService.setCache).toHaveBeenCalledWith('user:all:{}', users, 60);
      expect(result).toEqual(users);
    });
  });

  describe('count', () => {
    it('should return cached count if available', async () => {
      mockRedisService.getCache.mockResolvedValue(5);

      const result = await service.count();

      expect(redisService.getCache).toHaveBeenCalledWith('user:count:{}');
      expect(userRepository.count).not.toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should fetch from database and cache if not cached', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.count.mockResolvedValue(5);

      const result = await service.count();

      expect(redisService.getCache).toHaveBeenCalledWith('user:count:{}');
      expect(userRepository.count).toHaveBeenCalledWith({});
      expect(redisService.setCache).toHaveBeenCalledWith('user:count:{}', 5, 60);
      expect(result).toBe(5);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      fullname: 'Test User',
      password: 'password123',
    };

    it('should create a new user and clear cache', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('user:*');
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      fullname: 'Updated User',
    };

    it('should update user and clear cache', async () => {
      const updatedUser = { ...mockUser, fullname: 'Updated User' };
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(mockUser.id, updateUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('user:*');
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('student:*');
      expect(result).toEqual(updatedUser);
    });

    it('should hash password if provided', async () => {
      const updateWithPassword = { ...updateUserDto, password: 'newPassword123' };
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, password: 'hashedPassword' });

      await service.update(mockUser.id, updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 12);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(mockUser.id, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user and clear cache', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(mockUser.id);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('user:*');
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('student:*');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRedisService.getCache.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple users and clear cache', async () => {
      const ids = ['1', '2', '3'];
      mockUserRepository.delete.mockResolvedValue({ affected: 3 });

      await service.deleteMany(ids);

      expect(userRepository.delete).toHaveBeenCalledWith(ids);
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('user:*');
    });
  });

  describe('deleteAll', () => {
    it('should clear all users and cache', async () => {
      mockUserRepository.clear.mockResolvedValue(undefined);

      await service.deleteAll();

      expect(userRepository.clear).toHaveBeenCalled();
      expect(redisService.clearCachePattern).toHaveBeenCalledWith('user:*');
    });
  });
});