import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '../common/entities/user.entity';
import { CacheService } from '../common/cache/cache.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Role } from '../common/entities/enums';

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

const mockCacheConfig = {
  getTtl: jest.fn().mockReturnValue(1800),
  getKeyPrefix: jest.fn().mockReturnValue('school:'),
  isEnabled: jest.fn().mockReturnValue(true),
  getDefaultTtl: jest.fn().mockReturnValue(3600),
};

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  invalidateByTag: jest.fn(),
  getOrSet: jest.fn(),
  generateEntityCacheKey: jest.fn((entity, id) => `school:${entity}:${id}`),
  generateListCacheKey: jest.fn((entity, params) => `school:${entity}:list:${JSON.stringify(params)}`),
  generateCacheKey: jest.fn((...parts) => `school:${parts.join(':')}`),
  'cacheConfig': mockCacheConfig,
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheService = module.get<CacheService>(CacheService);

    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return cached user if available', async () => {
      mockCacheService.getOrSet.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should fetch from database and cache if not cached', async () => {
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return cached users if available', async () => {
      const users = [mockUser];
      mockCacheService.getOrSet.mockResolvedValue(users);

      const result = await service.findAll();

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(userRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should fetch from database and cache if not cached', async () => {
      const users = [mockUser];
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(userRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(users);
    });
  });

  describe('count', () => {
    it('should return cached count if available', async () => {
      mockCacheService.getOrSet.mockResolvedValue(5);

      const result = await service.count();

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(userRepository.count).not.toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should fetch from database and cache if not cached', async () => {
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.count.mockResolvedValue(5);

      const result = await service.count();

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(userRepository.count).toHaveBeenCalledWith({});
      expect(result).toBe(5);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      fullname: 'Test User',
      phone: '+1234567890',
      password: 'password123',
      role: Role.PARENT,
      age: 25,
      gender: 'Male',
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
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('user');
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
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(mockUser.id, updateUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('user');
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('student');
      expect(result).toEqual(updatedUser);
    });

    it('should hash password if provided', async () => {
      const updateWithPassword = { ...updateUserDto, password: 'newPassword123' };
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, password: 'hashedPassword' });

      await service.update(mockUser.id, updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 12);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(mockUser.id, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user and clear cache', async () => {
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(mockUser.id);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('user');
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('student');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockCacheService.getOrSet.mockImplementation(async (key, factory) => {
        return factory();
      });
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
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('user');
    });
  });

  describe('deleteAll', () => {
    it('should clear all users and cache', async () => {
      mockUserRepository.clear.mockResolvedValue(undefined);

      await service.deleteAll();

      expect(userRepository.clear).toHaveBeenCalled();
      expect(cacheService.invalidateByTag).toHaveBeenCalledWith('user');
    });
  });
});