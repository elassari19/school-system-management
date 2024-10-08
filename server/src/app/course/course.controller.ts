import { Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheHandler } from '../../utils/redisCache';
import { handleChaptersContent } from '../../utils/helper';

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.query;
  console.log('id:', id);
  try {
    const resp = await redisCacheHandler(
      id as string,
      async () =>
        await prisma.course.findUnique({
          where: {
            id: id as string,
          },
          include: {
            chapters: {
              include: {
                content: true,
              },
            },
          },
        })
    );
    return res.send({ 'GET /api/courses/:id': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.course.findMany();

    return res.send({ 'GET /api/courses': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const createCourse = async (req: Request, res: Response) => {
  const {
    title,
    description,
    instructor,
    duration,
    level,
    tags,
    chapters,
    thumbnail,
  } = req.body;

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
    return res.send({ 'POST /api/course': resp });
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
      include: {
        chapters: true,
      },
    });
    return res.send({ 'PUT /api/course/:id': resp });
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
    return res.send({ 'DELETE /api/courses/:id': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};
