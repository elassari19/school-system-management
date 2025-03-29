import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;

  try {
    const user = await redisCacheHandler(
      `user:${query.where?.id || 'single'}`,
      async () => await prisma.user.findUnique({
        ...query,
      })
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;

  try {
    const users = await redisCacheHandler(
      `user:all${JSON.stringify(query)}`,
      async () => await prisma.user.findMany({
        ...query,
      })
    );

    if (!users) {
      throw new Error('No users found');
    }

    return res.status(200).send(users);
  } catch (error) {
    console.log('error', error);
    next(error);
  }
};

export const countUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  
  try {
    const count = await redisCacheHandler(
      `user:count${JSON.stringify(query)}`,
      async () => await prisma.user.count({
        ...query,
      })
    );
    
    return res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { password, image, ...rest } = req.body;

  const existUser = await prisma.user.findUnique({
    where: { email: rest.email },
  });
  if (existUser) {
    return res.status(302).send('User already exist');
  }

  if (!password) {
    return res.status(400).send('Password is required');
  }

  try {
    // Hash the password with the salt
    const hashPassword = await hash(password, 12);

    // Attempt to create a new user in the database
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashPassword,
        image: faker.image.avatar(),
      },
    });

    if (!user) {
      throw new Error('User creation failed');
    }

    // Clear the cache after creating a new user
    await redisCacheClear('user:*');

    console.log('created user', user);
    // Return the created user back to the client
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user', error);
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { where, data, include } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where,
    });

    if (!existingUser) {
      return res.status(404).send('User Not found');
    }

    // Handle password update
    if (data.password) {
      const hashPassword = await hash(data.password, 12);
      data.password = hashPassword;
    }

    // Update user and related fields data
    const updatedUser = await prisma.user.update({
      where,
      data,
      include,
    });

    await redisCacheClear(`user:*`);
    await redisCacheClear(`student:*`);

    return res.status(200).send(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { where } = req.body;

  try {
    // check if user exist
    const user = await prisma.user.findUnique({
      where,
      include: {
        student: true,
      },
    });

    if (!user) {
      return res.status(404).send('User Not found');
    }

    // Attempt to delete the user and related data in a transaction
    const deleteResult = await prisma.$transaction(async (tx) => {
      // First delete the student record if it exists
      if (user.student.length > 0) {
        await tx.student.delete({
          where: { id: user.student[0].id },
        });
      }

      // Then delete the user
      return await tx.user.delete({
        where,
      });
    });

    console.log('delete user', deleteResult);
    // Clear the cache after successful deletion
    await redisCacheClear(`student:*`);
    await redisCacheClear(`user:*`);

    return res.status(200).send({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};

export const deleteManyUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;

  // Check if IDs are provided and not empty
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send('No user IDs provided');
  }

  try {
    const resp = await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    // Check if any users were deleted
    if (resp.count === 0) {
      return res.status(404).send('No users found for the provided IDs');
    }

    // Clear the cache after deleting the users
    await redisCacheClear(`user:*`);
    // Return the deleted users data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error('Error deleting users', error);
    next(error);
  }
};

export const deleteAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Attempt to delete all users from the database
    const resp = await prisma.user.deleteMany();

    // Check for null pointer references
    if (!resp) {
      return res.status(404).send('No users found');
    }

    // Clear the Redis cache for all users
    await redisCacheClear(`user:*`);
    // Return the deleted users data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error('Error deleting all users', error);
    // Pass the error down the middleware chain
    next(error);
  }
};
