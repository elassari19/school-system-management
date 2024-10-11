import { Request, Response } from 'express';
import { prisma, redis } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await redisCacheHandler(
      `course:${id}`,
      async () =>
        await prisma.course.findUnique({
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

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const resp = await redisCacheHandler(
      'course:',
      async () => await prisma.course.findMany()
    );

    return res.status(200).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const createCourse = async (req: Request, res: Response) => {
  const { title, description, instructor, duration, level, tags, thumbnail } =
    req.body;

  try {
    const resp = await prisma.course.create({
      data: {
        title,
        description,
        instructor,
        duration,
        level,
        tags,
        thumbnail, // @ts-ignore
        user: { connect: { id: req.user?.id } },
        // chapters: { create: handleChaptersContent(chapters) },
        subject: { connect: { id: '6704458709b43b9869453240' } },
      },
    });
    redisCacheClear('course:*');
    return res.status(201).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    return res.status(500).send('Internal server error');
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { title, description, instructor, duration, level, tags } = req.body;
  const { id } = req.query;

  try {
    const resp = await prisma.course.update({
      where: {
        id: id as string,
      },
      data: {
        title,
        description,
        instructor,
        duration,
        level,
        tags,
      },
    });
    redisCacheClear(`course:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await prisma.course.delete({
      where: {
        id: id as string,
      },
    });
    redisCacheClear(`course:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

// delete many courses
export const deleteManyCourses = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.course.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    redisCacheClear(`course:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

// delete all courses
export const deleteAllCourses = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.course.deleteMany({});
    redisCacheClear(`course:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};
