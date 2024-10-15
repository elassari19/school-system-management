import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';
import { hash } from 'bcryptjs';

// get user by id
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const findUser = await redisCacheHandler(
      `user:${id}`,
      async () =>
        await prisma.user.findUnique({
          where: { id: id as string },
        })
    );
    if (!findUser) return res.status(404).send('User not found');
    return res.status(200).send(findUser);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await redisCacheHandler(
      `user:`,
      async () => await prisma.user.findMany()
    );
    return res.status(200).send(users);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send({ error });
  }
};

// create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, ...rest } = req.body;
  // Hash the password with the salt
  const hashPassword = await hash(req.body.password, 12);
  console.log('user', req.user);

  try {
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashPassword,
      },
    });
    redisCacheClear('user:*');
    return res.status(201).json(user);
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

// update user by id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  const updateData = req.body;
  console.log('id', id, 'data', req.body);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: id as string },
    });

    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: {
        ...existingUser,
        ...updateData,
      },
    });

    redisCacheClear(`user:*`);
    return res.status(203).send(updatedUser);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

// delete user by id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const deleteUser = await prisma.user.delete({
      where: { id: id as string },
    });
    if (!deleteUser) return res.status(404).send('Not found');
    redisCacheClear(`user:*`);
    return res.status(203).send(deleteUser);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

// delete many users by ids
export const deleteManyUsers = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    redisCacheClear(`user:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

// delete all users
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.user.deleteMany();
    redisCacheClear(`user:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
