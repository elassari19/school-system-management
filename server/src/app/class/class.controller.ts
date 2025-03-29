import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';

export const getClass = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;
  try {
    // Look up class in cache
    const schoolClass = await prisma.class.findUnique({
      ...query,
    });

    // Return the class
    return res.status(200).send(schoolClass);
  } catch (error) {
    console.log('Error', error);
    next(error);
  }
};

export const getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;
  try {
    const schoolClass = await redisCacheHandler(
      'class:', // The key to store the result in Redis
      async () =>
        await prisma.class.findMany({
          orderBy: { createdAt: 'asc' },
          ...query,
        })
    );

    return res.status(200).send(schoolClass);
  } catch (error) {
    next(error);
  }
};

export const countClass = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;
  const count = await prisma.class.count({
    ...query,
  });
  return res.status(200).json(count);
};

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.body;

    // Create a new class
    const newClass = await prisma.class.create({
      ...query,
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the new class
    return res.status(201).send(newClass);
  } catch (error) {
    console.log('Error', error);
    // Return an error if something went wrong
    next(error);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
  const { where, data, include } = req.body;

  try {
    const existingClass = await prisma.class.findUnique({
      where,
    });
    if (!existingClass) {
      return res.status(404).send('Class not found');
    }
    // Update the class
    const resp = await prisma.class.update({
      // Update the class with the given ID
      where,
      // Update the class name and connect the user
      data,
      include,
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the updated class
    return res.status(203).send(resp);
  } catch (error) {
    // Log the error
    console.log('Error', error);
    // Return an error if something went wrong
    next(error);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the class ID from the request query
    const query = req.body;

    // Delete the class
    const resp = await prisma.class.delete({
      ...query,
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the deleted class
    return res.status(203).send(resp);
  } catch (error) {
    // Log the error
    console.log('Error', error);
    // Return an error if something went wrong
    next(error);
  }
};

export const deleteManyClasses = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;
  try {
    // Delete the classes
    const resp = await prisma.class.deleteMany({
      ...query,
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the deleted classes
    return res.status(203).send(resp);
  } catch (error) {
    // Log the error
    console.log('Error', error);
    // Return an error if something went wrong
    next(error);
  }
};

export const deleteAllClasses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all classes from the database
    const resp = await prisma.class.deleteMany({});

    // Clear the Redis cache for all classes
    redisCacheClear('class:*');

    // Send response with the deleted classes
    return res.status(203).send(resp);
  } catch (error) {
    // Log any errors that occur
    console.log('Error', error);

    // Send an error response if something goes wrong
    next(error);
  }
};
