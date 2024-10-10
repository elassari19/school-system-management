import { Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

export const getContent = async (req: Request, res: Response) => {
  const { id } = req.query;
  console.log('id:', id);
  try {
    const resp = await redisCacheHandler(
      id as string,
      async () =>
        await prisma.content.findUnique({
          where: {
            id: id as string,
          },
        })
    );
    return res.send({ 'GET /api/content/:id': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAllChapterContent = async (req: Request, res: Response) => {
  const { chapterId } = req.query;
  try {
    const resp = await prisma.content.findMany({
      where: {
        chapterId: chapterId as string,
      },
    });

    return res.send({ 'GET /api/courses': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAllContent = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.content.findMany();

    return res.send({ 'GET /api/courses': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const createContent = async (req: Request, res: Response) => {
  const { title, type, data } = req.body;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: req.query?.chapterId as string },
    });
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    const resp = await prisma.content.create({
      data: {
        type,
        title,
        data,
        chapter: { connect: { id: req.query?.chapterId as string } },
      },
    });
    return res.send({ 'POST /api/course': resp });
  } catch (error) {
    console.log('Error in createContent:', error);
    return res.status(500).send('Internal server error');
  }
};

export const updateContent = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const resp = await prisma.content.update({
      where: {
        id: id as string,
      },
      data: req.body,
    });
    return res.send({ 'PUT /api/content/:id': resp });
  } catch (error) {
    console.log('Error in updateContent:', error);
    res.status(500).send('Internal server error');
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const content = await prisma.content.findUnique({
      where: {
        id: id as string,
      },
    });
    if (!content) {
      redisCacheClear(id as string);
      return res.status(404).send('Content not found');
    }
    const resp = await prisma.content.delete({
      where: {
        id: id as string,
      },
    });
    redisCacheClear(id as string);
    return res.send({ 'DELETE /api/content/:id': resp });
  } catch (error) {
    console.log('Error in deleteContent:', error);
    res.status(500).send('Internal server error');
  }
};

export const deleteChapterContent = async (req: Request, res: Response) => {
  const { chapterId } = req.query;
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId as string },
    });
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    const resp = await prisma.content.deleteMany({
      where: {
        chapterId: chapterId as string,
      },
    });
    return res.send({ 'DELETE /api/content/all': resp });
  } catch (error) {
    console.log('Error in deleteContent:', error);
    res.status(500).send('Internal server error');
  }
};

export const deleteAllContent = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.content.deleteMany({});
    return res.send({ 'DELETE /api/content/all': resp });
  } catch (error) {
    console.log('Error in deleteContent:', error);
    res.status(500).send('Internal server error');
  }
};