import request from 'supertest';
import express from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheHandler, redisCacheClear } from '../../utils/redisCache';
import { createApp } from '..';

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

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/api/user', () => {
    it('should get a user by id', async () => {
      const mockGetOne = { id: '1', name: 'Test User' };
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockGetOne);

      const response = await request(app).get('/v1/api/user/?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGetOne);
    });

    it('should get all courses', async () => {
      const mockGetAll = [
        { id: '1', name: 'Test User 1' },
        { id: '2', name: 'Test User 2' },
      ];
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockGetAll);

      const response = await request(app).get('/v1/api/user/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGetAll);
    });
  });

  describe('POST /v1/api/user', () => {
    const mockUser = { id: 'user123' };

    // Mock the authentication middleware
    // jest
    //   .spyOn(
    //     require('../../middelwares/passport.middelware'),
    //     'isAdminOrTeacher()'
    //   )
    //   .mockImplementation((req, res, next) => {
    //     // @ts-ignore
    //     req.user = { id: 'user123', role: 'ADMIN' };
    //     // @ts-ignore
    //     next(req);
    //   });

    it('should create a new user', async () => {
      const mockCreate = {
        email: 'email@gmail.com',
        fullname: 'New User',
        password: 'anyany',
        role: 'ADMIN',
        phone: '2125490843580',
        age: '35',
        gender: 'male',
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreate);

      const response = await request(app).post('/v1/api/user').send(mockCreate);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreate);
      expect(redisCacheClear).toHaveBeenCalledWith('user:*');
    });
  });

  describe('PUT /v1/api/user', () => {
    it('should update a user', async () => {
      const mockUpdated = {
        email: 'email@gmail.com',
        fullname: 'New User',
        password: 'anyany',
        role: 'ADMIN',
        phone: '2125490843580',
        age: '35',
        gender: 'male',
      };
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUpdated,
      });
      const response = await request(app)
        .put('/v1/api/user/?id=1')
        .send(mockUpdated);

      expect(response.status).toBe(203);
      expect(response.body).toEqual({ ...mockUpdated });
      expect(redisCacheClear).toHaveBeenCalledWith('user:*');
    });
  });

  describe('DELETE /v1/api/user', () => {
    it('should delete a user', async () => {
      const mockDeleted = { id: '1', name: 'Deleted User' };
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockDeleted);

      const response = await request(app).delete('/v1/api/user?id=1');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeleted);
      expect(redisCacheClear).toHaveBeenCalledWith('user:*');
    });

    it('should delete many users', async () => {
      const mockDeletedMany = [
        { id: '1', name: 'Deleted User 1' },
        { id: '2', name: 'Deleted User 2' },
      ];
      (prisma.user.deleteMany as jest.Mock).mockResolvedValue(mockDeletedMany);

      const response = await request(app)
        .delete('/v1/api/user/many')
        .send({ ids: ['1', '2'] });

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedMany);
      expect(redisCacheClear).toHaveBeenCalledWith('user:*');
    });

    it('should delete all users', async () => {
      const mockDeletedCourses = [
        { id: '1', name: 'Deleted User 1' },
        { id: '2', name: 'Deleted User 2' },
      ];
      (prisma.user.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app).delete('/v1/api/user/all');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('user:*');
    });
  });
});
