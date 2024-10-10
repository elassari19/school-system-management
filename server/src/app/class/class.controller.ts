import { Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

// Get class by id
export const getClass = async (req: Request, res: Response) => {
  try {
    const schoolClass = await redisCacheHandler(
      `class:${req.query.id}`,
      async () =>
        await prisma.class.findUnique({
          where: {
            id: req.query.id as string,
          },
        })
    );

    return res.status(200).send(schoolClass);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// Get all Classes
export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const schoolClass = await redisCacheHandler(
      'class:',
      async () =>
        await prisma.class.findMany({
          orderBy: { createdAt: 'asc' },
        })
    );

    return res.status(200).send(schoolClass);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

// Create a class
export const createClass = async (req: Request, res: Response) => {
  console.log(req.session);
  try {
    const { name } = req.body;

    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const newCalss = await prisma.class.create({
      data: {
        name: name, // @ts-ignore
        user: { connect: { id: req.user.id } },
      },
    });
    redisCacheClear(`class:*`);
    return res.status(201).send(newCalss);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error: error });
  }
};

// Update a class
export const updateClass = async (req: Request, res: Response) => {
  const { name } = req.body; // @ts-ignore
  const { id } = req.user;
  try {
    const resp = await prisma.class.update({
      where: {
        id: req.query.id as string,
      },
      data: {
        name,
        users: { connect: { id } },
      },
    });
    redisCacheClear(`class:*`);
    return res.status(200).send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// Delete a class
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.class.delete({
      where: {
        id: req.query.id as string,
      },
    });
    redisCacheClear(`class:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// delete many classes
export const deleteManyClasses = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.class.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    redisCacheClear(`class:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};

// delete all classes
export const deleteAllClasses = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.class.deleteMany({});
    redisCacheClear('class:*');
    return res.status(203).send(resp);
  } catch (error) {
    console.log('Error', error);
    return res.status(500).send({ error });
  }
};
