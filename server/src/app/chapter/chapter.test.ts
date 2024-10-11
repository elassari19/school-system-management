import request from 'supertest';
import express from 'express';
import { prisma, redis } from '../../utils/configs';
import { redisCacheHandler, redisCacheClear } from '../../utils/redisCache';
import chapterRouter from './chapter.route';

jest.mock('../../utils/configs', () => ({
  prisma: {
    chapter: {
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
app.use('/v1/api/chapter', chapterRouter);

describe('Chapter Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/api/chapter', () => {
    it('should get a chapter by id', async () => {
      const mockChapter = {
        title: 'Test Chapter',
        description: 'Test Description',
        duration: 60,
      };
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockChapter);

      const response = await request(app).get('/v1/api/chapter/?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockChapter);
    });

    it('should get all courses', async () => {
      const mockGetAllChapter = [
        {
          title: 'Test Chapter 1',
          description: 'Test Description',
          duration: 60,
        },
        {
          title: 'Test Chapter 2',
          description: 'Test Chapter 2',
          duration: 60,
        },
      ];
      (redisCacheHandler as jest.Mock).mockResolvedValue(mockGetAllChapter);

      const response = await request(app).get('/v1/api/chapter/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGetAllChapter);
    });
  });

  describe('POST /v1/api/chapter', () => {
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

    it('should create a new chapter', async () => {
      const mockCreateChapter = {
        title: 'Test Chapter',
        description: 'Test Description',
        duration: 60,
      };
      (prisma.chapter.create as jest.Mock).mockResolvedValue(mockCreateChapter);

      const response = await request(app)
        .post('/v1/api/chapter')
        .send(mockCreateChapter);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreateChapter);
      expect(redisCacheClear).toHaveBeenCalledWith('chapter:*');
    });
  });

  describe('PUT /v1/api/chapter', () => {
    it('should update a chapter', async () => {
      const mockPutChapter = {
        title: 'Test Update Chapter',
        description: 'Test Update Description',
        duration: 60,
      };
      (prisma.chapter.update as jest.Mock).mockResolvedValue(mockPutChapter);
      const response = await request(app)
        .put('/v1/api/chapter/?id=1')
        .send(mockPutChapter);

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockPutChapter);
      expect(redisCacheClear).toHaveBeenCalledWith('chapter:*');
    });
  });

  describe('DELETE /v1/api/chapter', () => {
    const mockDeletedChapter = [
      {
        id: '1',
        title: 'Deleted Chapter',
        description: 'Deleted Description',
        duration: 60,
      },
      {
        id: '2',
        title: 'Deleted Chapter 2',
        description: 'Deleted Description 2',
        duration: 60,
      },
    ];

    it('should delete a chapter', async () => {
      (prisma.chapter.delete as jest.Mock).mockResolvedValue(
        mockDeletedChapter[0]
      );

      const response = await request(app).delete('/v1/api/chapter?id=1');
      console.log('response', response.body);

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedChapter[0]);
      expect(redisCacheClear).toHaveBeenCalledWith('chapter:*');
    });

    it('should delete many courses', async () => {
      (prisma.chapter.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedChapter
      );

      const response = await request(app)
        .delete('/v1/api/chapter/many')
        .send({ ids: ['1', '2'] });

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedChapter);
      expect(redisCacheClear).toHaveBeenCalledWith('chapter:*');
    });

    it('should delete all courses', async () => {
      (prisma.chapter.deleteMany as jest.Mock).mockResolvedValue(
        mockDeletedChapter
      );

      const response = await request(app).delete('/v1/api/chapter/all');

      expect(response.status).toBe(203);
      expect(response.body).toEqual(mockDeletedChapter);
      expect(redisCacheClear).toHaveBeenCalledWith('chapter:*');
    });
  });
});
