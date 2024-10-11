import { Request, Response } from 'express';
import { prisma, redis } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

export const getContent = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await redisCacheHandler(
      `content:${id}`,
      async () =>
        await prisma.content.findUnique({
          where: {
            id: id as string,
          },
        })
    );
    return res.status(200).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAllChapterContent = async (req: Request, res: Response) => {
  const { chapterId } = req.query;
  try {
    const resp = await redisCacheHandler(
      `content:${chapterId}`,
      async () =>
        await prisma.content.findMany({
          where: {
            chapterId: chapterId as string,
          },
        })
    );

    return res.status(200).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAllContent = async (req: Request, res: Response) => {
  try {
    const resp = await redisCacheHandler(
      'content:',
      async () => await prisma.content.findMany()
    );

    return res.status(200).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const createContent = async (req: Request, res: Response) => {
  const { title, type, data } = req.body;
  const { chapterId } = req.query;

  try {
    const chapter = async () =>
      await prisma.chapter.findUnique({
        where: {
          id: chapterId as string,
        },
      });
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    const resp = await prisma.content.create({
      data: {
        type,
        title,
        data,
        chapter: { connect: { id: chapterId as string } },
      },
    });
    redisCacheClear('content:*');
    return res.status(201).send(resp);
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
    redisCacheClear('content:*');
    return res.status(203).send(resp);
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
      redisCacheClear('content:*');
      return res.status(404).send('Content not found');
    }
    const resp = await prisma.content.delete({
      where: {
        id: id as string,
      },
    });
    redisCacheClear('content:*');
    return res.status(203).send(resp);
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
      redisCacheClear('content:*');
      return res.status(404).send('Chapter not found');
    }
    const resp = await prisma.content.deleteMany({
      where: {
        chapterId: chapterId as string,
      },
    });
    redisCacheClear('content:*');
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in deleteContent:', error);
    res.status(500).send('Internal server error');
  }
};

// delete many content
export const deleteManyContent = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.content.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    redisCacheClear('content:*');
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in deleteContent:', error);
    return res.status(500).send({ error });
  }
};

export const deleteAllContent = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.content.deleteMany({});
    redisCacheClear('content:*');
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in deleteContent:', error);
    res.status(500).send('Internal server error');
  }
};
