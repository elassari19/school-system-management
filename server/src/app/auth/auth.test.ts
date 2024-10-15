import request from 'supertest';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';
import { createApp } from '..';
import * as bcrypt from 'bcryptjs';

jest.mock('../../utils/configs', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock('../../utils/redisCache', () => ({
  redisCacheHandler: jest.fn(),
  redisCacheClear: jest.fn(),
}));

const app = createApp();

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST: /v1/api/auth', () => {
    const mockCreate = {
      fullname: 'user name',
      email: 'test@gmail.com',
      role: 'STUDENT',
      password: 'password',
      confirmPassword: 'password',
      address: 'user address',
    };
    it('Should sign-up field, not valid data', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreate);

      const response = await request(app).post('/v1/api/auth').send({
        email: mockCreate.email,
        password: mockCreate.password,
        confirmPassword: mockCreate.confirmPassword,
        role: mockCreate.role,
      });

      expect(response.status).toBe(403);
    });

    it('Should sign-up field, password not match', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreate);

      const response = await request(app)
        .post('/v1/api/auth')
        .send({
          ...mockCreate,
          confirmPassword: 'wrong-password',
        });

      expect(response.status).toBe(403);
    });

    it('Should sign-up success', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreate);

      const response = await request(app).post('/v1/api/auth').send(mockCreate);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreate);
      expect(redisCacheClear).toHaveBeenCalledWith('course:*');
    });
  });

  describe('sign-in by email and password', () => {
    const mockUser = {
      id: 1,
      password: 'password',
      email: 'test@gmail.com',
    };
    it('Should sing-in field, user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/v1/api/auth/sign-in').send({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('Should sign-in field, wrong passowrd', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/v1/api/auth/sign-in').send({
        email: mockUser.email,
        password: 'wrong-password',
      });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('Should sign-in successfully with correct hashed password', async () => {
      const hashedPassword = await bcrypt.hash('password', 12);

      (redisCacheHandler as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const response = await request(app).post('/v1/api/auth/sign-in').send({
        email: mockUser.email,
        password: 'password',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Logged in successfully',
        user: { id: mockUser.id, email: mockUser.email },
      });
    });
  });

  describe('sign-out', () => {
    it('Should sing-out success', async () => {
      const response = await request(app).get('/v1/api/auth/sign-out');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});
