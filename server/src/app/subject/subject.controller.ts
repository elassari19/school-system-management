import { Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

// Get subject by id
export const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await redisCacheHandler(
      `subject:${req.query.id}`,
      async () =>
        await prisma.subject.findUnique({
          where: {
            id: req.query.id as string,
          },
        })
    );

    return res.status(200).send(subject);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subject = await redisCacheHandler(
      `subject:`,
      async () =>
        await prisma.subject.findMany({
          orderBy: { createdAt: 'asc' },
        })
    );

    return res.status(200).send(subject);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

// Create a subject
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
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
    redisCacheClear('subject:*');
    return res.status(201).send(newSubject);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error: error });
  }
};

// Update a subject
export const updateSubject = async (req: Request, res: Response) => {
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
    redisCacheClear(`subject:*`);
    return res.status(203).send(resp);
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
    redisCacheClear(`subject:*`);
    return res.send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// delete many subjects
export const deleteManySubjects = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.subject.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    redisCacheClear(`subject:*`);
    return res.send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// delete all subjects
export const deleteAllSubjects = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.subject.deleteMany({});
    redisCacheClear(`subject:*`);
    return res.send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};
