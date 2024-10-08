import { Request, Response } from 'express';
import { ExtendsSessionRequest } from '../auth/auth.types';
import { prisma } from '../../utils/configs';

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await prisma.course.findUnique({
      where: {
        id: id as string,
      },
    });
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
        chapters,
        thumbnail, // @ts-ignore
        user: { connect: { id: req.user?.id } },
        subject: { connect: { id: '6704458709b43b9869453240' } },
      },
    });
    return res.send({ 'POST /api/courses': resp });
  } catch (error) {
    console.log('Error in getCourse:', error);
    res.status(500).send('Internal server error');
  }
};

export const updateCourse = async (req: Request, res: Response) => {
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
        chapters,
        thumbnail,
      },
    });
    return res.send({ 'PUT /api/courses/:id': resp });
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
