import request from 'supertest';
import { prisma } from '../../utils/configs';
import { redisCacheHandler, redisCacheClear } from '../../utils/redisCache';
import { createApp } from '..';

jest.mock('../../utils/configs', () => ({
  prisma: {
    class: {
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

describe('Class Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/api/class', () => {
    it('should get a class by id', async () => {
      const mockClass = { id: '1', name: 'Test Class' };
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockClass);

      const response = await request(app).get('/v1/api/class/?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClass);
    });

    it('should get all courses', async () => {
      const mockCourses = [
        { id: '1', name: 'Test Class 1' },
        { id: '2', name: 'Test Class 2' },
      ];
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get('/v1/api/class/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
    });
  });

  describe('POST /v1/api/class', () => {
    // Mock the authentication middleware
    jest
      .spyOn(
        require('../../middelwares/passport.middelware'),
        'isAdminOrTeacher'
      )
      .mockImplementation((req, res, next) => {
        // @ts-ignore
        req.user = { id: 'user123' };
        // @ts-ignore
        next();
      });

    it('should create a new class', async () => {
      const mockClass = {
        name: 'New Class',
      };
      (prisma.class.create as jest.Mock).mockResolvedValue(mockClass);

      const response = await request(app).post('/v1/api/class').send(mockClass);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockClass);
      expect(redisCacheClear).toHaveBeenCalledWith('class:*');
    });
  });

  describe('PUT /v1/api/class', () => {
    it('should update a class', async () => {
      const mockUpdatedClass = {
        name: 'Updated Class',
      };
      (prisma.class.update as jest.Mock).mockResolvedValue(mockUpdatedClass);
      const response = await request(app)
        .put('/v1/api/class/?id=1')
        .send(mockUpdatedClass);

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockUpdatedClass);
      expect(redisCacheClear).toHaveBeenCalledWith('class:*');
    });
  });

  describe('DELETE /v1/api/class', () => {
    it('should delete a class', async () => {
      const mockDeletedCourse = { id: '1', name: 'Deleted Class' };
      (prisma.class.delete as jest.Mock).mockResolvedValue(mockDeletedCourse);

      const response = await request(app).delete('/v1/api/class?id=1');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourse);
      expect(redisCacheClear).toHaveBeenCalledWith('class:*');
    });

    it('should delete many courses', async () => {
      const mockDeletedCourses = [
        { id: '1', name: 'Deleted Class 1' },
        { id: '2', name: 'Deleted Class 2' },
      ];
      (prisma.class.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app)
        .delete('/v1/api/class/many')
        .send({ ids: ['1', '2'] });

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('class:*');
    });

    it('should delete all courses', async () => {
      const mockDeletedCourses = [
        { id: '1', name: 'Deleted Class 1' },
        { id: '2', name: 'Deleted Class 2' },
      ];
      (prisma.class.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app).delete('/v1/api/class/all');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('class:*');
    });
  });
});
