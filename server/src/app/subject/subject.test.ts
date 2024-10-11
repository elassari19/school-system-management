import request from 'supertest';
import express from 'express';
import { prisma, redis } from '../../utils/configs';
import { redisCacheHandler, redisCacheClear } from '../../utils/redisCache';
import subjectRouter from './subject.route';

jest.mock('../../utils/configs', () => ({
  prisma: {
    subject: {
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

const app = express();
app.use(express.json());
app.use('/v1/api/subject', subjectRouter);

describe('Subject Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/api/subject', () => {
    it('should get a subject by id', async () => {
      const mockSubject = { id: '1', name: 'Test Subject' };
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockSubject);

      const response = await request(app).get('/v1/api/subject/?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSubject);
    });

    it('should get all courses', async () => {
      const mockCourses = [
        { id: '1', name: 'Test Subject 1' },
        { id: '2', name: 'Test Subject 2' },
      ];
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get('/v1/api/subject/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
    });
  });

  describe('POST /v1/api/subject', () => {
    const mockUser = { id: 'user123' };

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

    it('should create a new subject', async () => {
      const mockSubject = {
        name: 'New Subject',
      };
      (prisma.subject.create as jest.Mock).mockResolvedValue(mockSubject);

      const response = await request(app)
        .post('/v1/api/subject')
        .send(mockSubject);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockSubject);
      expect(redisCacheClear).toHaveBeenCalledWith('subject:*');
    });
  });

  describe('PUT /v1/api/subject', () => {
    it('should update a subject', async () => {
      const mockUpdatedSubject = {
        name: 'Updated Subject',
      };
      (prisma.subject.update as jest.Mock).mockResolvedValue(
        mockUpdatedSubject
      );
      const response = await request(app)
        .put('/v1/api/subject/?id=1')
        .send(mockUpdatedSubject);

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockUpdatedSubject);
      expect(redisCacheClear).toHaveBeenCalledWith('subject:*');
    });
  });

  describe('DELETE /v1/api/subject', () => {
    it('should delete a subject', async () => {
      const mockDeletedCourse = { id: '1', name: 'Deleted Subject' };
      (prisma.subject.delete as jest.Mock).mockResolvedValue(mockDeletedCourse);

      const response = await request(app).delete('/v1/api/subject?id=1');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourse);
      expect(redisCacheClear).toHaveBeenCalledWith('subject:*');
    });

    it('should delete many courses', async () => {
      const mockDeletedCourses = [
        { id: '1', name: 'Deleted Subject 1' },
        { id: '2', name: 'Deleted Subject 2' },
      ];
      (prisma.subject.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app)
        .delete('/v1/api/subject/many')
        .send({ ids: ['1', '2'] });

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('subject:*');
    });

    it('should delete all courses', async () => {
      const mockDeletedCourses = [
        { id: '1', name: 'Deleted Subject 1' },
        { id: '2', name: 'Deleted Subject 2' },
      ];
      (prisma.subject.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedCourses
      );

      const response = await request(app).delete('/v1/api/subject/all');
      console.log('response-delete', response.body);

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedCourses);
      expect(redisCacheClear).toHaveBeenCalledWith('subject:*');
    });
  });
});
