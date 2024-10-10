import request from 'supertest';
import express from 'express';
import contentRouter from './content.route';
import * as contentController from './content.controller';
import { prisma } from '../../utils/configs';
import { creatApp } from '..';

jest.mock('../../utils/configs', () => ({
  prisma: {
    content: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    chapter: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../utils/redisCache', () => ({
  redisCacheHandler: jest.fn((key, callback) => callback()),
  redisCacheClear: jest.fn(),
}));

const app = creatApp();
app.use(express.json());
app.use('/v1/api/content', contentRouter);

describe('Content API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockContent = {
    id: '1',
    title: 'Test Content',
    type: 'text',
    data: 'Some text content',
  };

  describe('GET /content', () => {
    it('should get content by ID', async () => {
      (prisma.content.findUnique as jest.Mock).mockResolvedValue(mockContent);

      const response = await request(app).get('/v1/api/content/?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 'GET /api/content/:id': mockContent });
    });

    it('should return 200 content not found', async () => {
      (prisma.content.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/v1/api/content/?id=2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 'GET /api/content/:id': null });
    });
  });

  describe('GET /content/chapter', () => {
    it('should get all chapter content', async () => {
      const mockChapterContent = [{ id: '1', title: 'Chapter Content 1' }];
      (prisma.content.findMany as jest.Mock).mockResolvedValue(
        mockChapterContent
      );

      const response = await request(app).get(
        '/v1/api/content/chapter?chapterId=1'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 'GET /api/courses': mockChapterContent });
    });
  });

  describe('POST /content', () => {
    it('should create new content', async () => {
      (prisma.chapter.findUnique as jest.Mock).mockResolvedValue(mockContent);

      (prisma.content.create as jest.Mock).mockResolvedValue(mockContent);

      const newContent = {
        type: 'text',
        title: 'New Content',
        data: 'Some text content',
      };

      const response = await request(app)
        .post('/v1/api/content?chapterId=1')
        .send(newContent);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 'POST /api/course': mockContent });
    });
  });

  describe('PUT /content', () => {
    const updatedContent = {
      type: 'text',
      title: 'Updated Content',
      data: 'Updated text content',
    };

    it('should update content', async () => {
      (prisma.content.update as jest.Mock).mockResolvedValue(updatedContent);

      const response = await request(app)
        .put('/v1/api/content?id=1')
        .send(updatedContent);
      console.log('jestresponse:', response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        'PUT /api/content/:id': updatedContent,
      });
    });
  });

  describe('DELETE /content', () => {
    it('should delete content', async () => {
      (prisma.content.findUnique as jest.Mock).mockResolvedValue(mockContent);
      (prisma.content.delete as jest.Mock).mockResolvedValue(mockContent);

      const response = await request(app).delete('/v1/api/content?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        'DELETE /api/content/:id': mockContent,
      });
    });

    it('should return 404 if content not found', async () => {
      (prisma.content.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/v1/api/content?id=1');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Content not found');
    });
  });

  // exisitng test
});
