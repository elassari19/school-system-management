import { Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

export const getChapter = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await redisCacheHandler(
      `chapter:${id}`,
      async () =>
        await prisma.chapter.findUnique({
          where: {
            id: id as string,
          },
        })
    );
    return res.status(200).send({ 'GET /api/chapter/:id': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAllChapter = async (req: Request, res: Response) => {
  try {
    const resp = await redisCacheHandler(
      'chapter:',
      async () => await prisma.chapter.findMany()
    );

    return res.status(200).send({ 'GET /api/courses': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const createChapter = async (req: Request, res: Response) => {
  const { title, description, duration } = req.body;

  try {
    const resp = await prisma.chapter.create({
      data: {
        title,
        description,
        duration, // @ts-ignore
        course: { connect: { id: req.query?.courseId } },
      },
    });
    redisCacheClear('chapter:*');
    return res.status(201).send({ 'POST /api/course': resp });
  } catch (error) {
    console.log('Error in createChapter:', error);
    return res.status(500).send('Internal server error');
  }
};

export const updateChapter = async (req: Request, res: Response) => {
  const { title, description, duration } = req.body;
  const { id } = req.query;

  try {
    const resp = await redisCacheHandler(
      `chapter:${id}`,
      async () =>
        await prisma.chapter.update({
          where: {
            id: id as string,
          },
          data: {
            title,
            description,
            duration,
          },
        })
    );
    redisCacheClear('chapter:*');
    return res.status(203).send({ 'PUT /api/chapter/:id': resp });
  } catch (error) {
    console.log('Error in updateChapter:', error);
    res.status(500).send('Internal server error');
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: id as string,
      },
    });
    if (!chapter) {
      redisCacheClear(id as string);
      return res.status(404).send('Chapter not found');
    }
    const resp = await prisma.chapter.delete({
      where: {
        id: id as string,
      },
    });
    redisCacheClear('chapter:*');
    return res.status(203).send({ 'DELETE /api/chapter/:id': resp });
  } catch (error) {
    console.log('Error in deleteChapter:', error);
    res.status(500).send('Internal server error');
  }
};

// delete many chapters
export const deleteManyChapter = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.chapter.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    redisCacheClear('chapter:*');
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in deleteChapter:', error);
    return res.status(500).send({ error });
  }
};

export const deleteAllChapter = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.chapter.deleteMany({});
    redisCacheClear('chapter:*');
    return res.status(203).send({ 'DELETE /api/chapter/all': resp });
  } catch (error) {
    console.log('Error in deleteChapter:', error);
    res.status(500).send('Internal server error');
  }
};
