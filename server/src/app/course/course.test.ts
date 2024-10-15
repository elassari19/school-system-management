import request from 'supertest';
import { prisma } from '../../utils/configs';
import { redisCacheHandler, redisCacheClear } from '../../utils/redisCache';
import { createApp } from '..';

jest.mock('../../utils/configs', () => ({
  prisma: {
    course: {
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

describe('Course Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/api/course', () => {
    it('should get a course by id', async () => {
      const mockCourse = { id: '1', title: 'Test Course' };
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app).get('/v1/api/course/?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourse);
    });

    it('should get all courses', async () => {
      const mockCourses = [
        { id: '1', title: 'Test Course 1' },
        { id: '2', title: 'Test Course 2' },
      ];
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get('/v1/api/course/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
    });
  });

  describe('POST /v1/api/course', () => {
    it('should create a new course', async () => {
      const mockCourse = {
        title: 'New Course',
        description: 'Course description',
        instructor: 'John Doe',
        duration: 60,
        level: 'beginner',
        tags: ['programming'],
        thumbnail: 'https://example.com/thumbnail.jpg',
      };

      (prisma.course.create as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app)
        .post('/v1/api/course')
        .send(mockCourse);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCourse);
      expect(redisCacheClear).toHaveBeenCalledWith('course:*');
    });
  });

  describe('PUT /v1/api/course', () => {
    it('should update a course', async () => {
      const mockUpdatedCourse = {
        title: 'Updated Course',
        description: 'Updated description',
        instructor: 'Jane Doe',
        duration: 90,
        level: 'intermediate',
        tags: ['programming', 'web'],
      };

      (prisma.course.update as jest.Mock).mockResolvedValue(mockUpdatedCourse);

      const response = await request(app)
        .put('/v1/api/course/?id=1')
        .send(mockUpdatedCourse);

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockUpdatedCourse);
      expect(redisCacheClear).toHaveBeenCalledWith('course:*');
    });
  });

  describe('DELETE /v1/api/course', () => {
    it('should delete a course', async () => {
      const mockDeletedCourse = { id: '1', title: 'Deleted Course' };
      (prisma.course.delete as jest.Mock).mockResolvedValue(mockDeletedCourse);

      const response = await request(app).delete('/v1/api/course?id=1');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourse);
      expect(redisCacheClear).toHaveBeenCalledWith('course:*');
    });

    it('should delete many courses', async () => {
      const mockDeletedCourses = [
        { id: '1', title: 'Deleted Course 1' },
        { id: '2', title: 'Deleted Course 2' },
      ];
      (prisma.course.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app)
        .delete('/v1/api/course/many')
        .send({ ids: ['1', '2'] });

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('course:*');
    });

    it('should delete all courses', async () => {
      const mockDeletedCourses = [
        { id: '1', title: 'Deleted Course 1' },
        { id: '2', title: 'Deleted Course 2' },
      ];
      (prisma.course.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app).delete('/v1/api/course/all');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('course:*');
    });
  });
});
