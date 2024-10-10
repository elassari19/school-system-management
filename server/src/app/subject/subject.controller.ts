import { Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { ExtendsSessionRequest } from '../auth/auth.types';
import { redisCacheHandler } from '../../utils/redisCache';

// Get subject by id
export const getSubject = async (req: Request, res: Response) => {
  console.log('req.params', req.params);
  try {
    const subject = await redisCacheHandler(
      req.query.id as string,
      async () =>
        await prisma.subject.findUnique({
          where: {
            id: req.query.id as string,
          },
        })
    );
    console.log('subject', subject);

    return res.send(subject);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subject = await redisCacheHandler(
      'subjects',
      async () =>
        await prisma.subject.findMany({
          orderBy: { createdAt: 'asc' },
        })
    );

    console.log('subject', subject);
    return res.send(subject);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

// Create a subject
export const createSubject = async (
  req: ExtendsSessionRequest,
  res: Response
) => {
  console.log(req.session);
  try {
    const { name } = req.body;

    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const newSubject = await prisma.subject.create({
      data: {
        name: name,
        createdBy: {
          // @ts-ignore
          connect: { id: req.user.id },
        },
      },
    });
    return res.send(newSubject);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error: error });
  }
};

// Update a subject
export const updateSubject = async (
  req: ExtendsSessionRequest,
  res: Response
) => {
  const { name } = req.body; // @ts-ignore
  const { id } = req.user;
  try {
    const resp = await prisma.subject.update({
      where: {
        id: req.query.id as string,
      },
      data: {
        name: name,
        createdBy: {
          connect: { id },
        },
      },
    });
    return res.send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// Delete a subject
export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await prisma.subject.delete({
      where: {
        id: req.query.id as string,
      },
    });
    return res.send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};
