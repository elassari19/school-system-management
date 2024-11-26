import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";

export const getClass = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    // Look up class in cache
    const schoolClass = await redisCacheHandler(
      `class:${req.query.id}`,
      async () =>
        // If not in cache, look up in database
        await prisma.class.findUnique({
          where: {
            id: req.query.id as string,
          },
          ...option, // @ts-ignore
        })
    );

    // Return the class
    return res.status(200).send(schoolClass);
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};

export const getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    const schoolClass = await redisCacheHandler(
      "class:", // The key to store the result in Redis
      async () =>
        await prisma.class.findMany({
          orderBy: { createdAt: "asc" },
          ...option,
        })
    );

    return res.status(200).send(schoolClass);
  } catch (error) {
    next(error);
  }
};

export const countClass = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  const count = await prisma.class.count({
    ...option,
  });
  return res.status(200).json(count);
};

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    // Create a new class
    const newClass = await prisma.class.create({
      data: {
        name: name, // @ts-ignore
        user: { connect: { id: req.user?.id } },
      },
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the new class
    return res.status(201).send(newClass);
  } catch (error) {
    console.log("Error", error);
    // Return an error if something went wrong
    next(error);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  // Get the class ID from the request query
  const classId = req.query.id as string;

  try {
    // Update the class
    const resp = await prisma.class.update({
      // Update the class with the given ID
      where: { id: classId },
      // Update the class name and connect the user
      data: {
        name, // @ts-ignore
        users: { connect: { id: req.user?.id } },
      },
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the updated class
    return res.status(203).send(resp);
  } catch (error) {
    // Log the error
    console.log("Error", error);
    // Return an error if something went wrong
    next(error);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the class ID from the request query
    const classId = req.query.id as string;

    // Delete the class
    const resp = await prisma.class.delete({
      // Delete the class with the given ID
      where: {
        id: classId,
      },
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the deleted class
    return res.status(203).send(resp);
  } catch (error) {
    // Log the error
    console.log("Error", error);
    // Return an error if something went wrong
    next(error);
  }
};

export const deleteManyClasses = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  try {
    // Delete the classes
    const resp = await prisma.class.deleteMany({
      // Delete the classes with the given IDs
      where: {
        id: { in: ids },
      },
    });

    // Clear the Redis cache
    redisCacheClear(`class:*`);

    // Return the deleted classes
    return res.status(203).send(resp);
  } catch (error) {
    // Log the error
    console.log("Error", error);
    // Return an error if something went wrong
    next(error);
  }
};

export const deleteAllClasses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all classes from the database
    const resp = await prisma.class.deleteMany({});

    // Clear the Redis cache for all classes
    redisCacheClear("class:*");

    // Send response with the deleted classes
    return res.status(203).send(resp);
  } catch (error) {
    // Log any errors that occur
    console.log("Error", error);

    // Send an error response if something goes wrong
    next(error);
  }
};
