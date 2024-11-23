import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";

export const getSubject = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    // Look up subject in cache
    const subject = await redisCacheHandler(
      `subject:${req.query.id}`,
      async () =>
        // If not in cache, look up in database
        await prisma.subject.findUnique({
          where: {
            id: req.query.id as string,
          },
          ...option,
        })
    );

    return res.status(200).send(subject);
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};

export const getAllSubjects = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;

  try {
    // Attempt to retrieve all subjects from cache, or database if cache is empty
    const subjects = await redisCacheHandler(
      `subject:`,
      async () =>
        // If cache is empty, get all subjects from database
        await prisma.subject.findMany({
          orderBy: { createdAt: "asc" },
          ...option,
        })
    );

    // Send response back to the client
    return res.status(200).send(subjects);
  } catch (error) {
    // If there's an error, log it and send back an internal server error response
    console.log("Error", error);
    next(error);
  }
};

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  try {
    // Create a new subject
    const newSubject = await prisma.subject.create({
      data: {
        name: name,
        createdBy: {
          // @ts-ignore
          connect: { id: req.user?.id },
        },
      },
    });
    // Clear the cache for all subjects after creating a new one
    redisCacheClear("subject:*");
    return res.status(201).send(newSubject);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ error: error });
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  try {
    // Update the subject with the new name
    const resp = await prisma.subject.update({
      // Find the subject with the given ID
      where: {
        id: req.query.id as string,
      },
      // Update the subject with the given name
      data: {
        name: name,
      },
    });
    // Clear the cache for all subjects after updating one
    redisCacheClear(`subject:*`);
    // Return the updated subject
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    // If there's an error, log it and send back an internal server error response
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;

  try {
    // Look up subject in database
    const resp = await prisma.subject.delete({
      // Find the subject with the given ID
      where: {
        id: id as string,
      },
    });
    // Clear the cache for all subjects after deleting one
    redisCacheClear(`subject:*`);
    // Return the deleted subject
    return res.status(203).send(resp);
  } catch (error) {
    // If there's an error, log it and send back an internal server error response
    console.log("Error", error);
    next(error);
  }
};

export const deleteManySubjects = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  try {
    // Delete all subjects that match the given IDs
    const resp = await prisma.subject.deleteMany({
      // Find the subjects with the given IDs
      where: {
        id: {
          in: ids,
        },
      },
    });
    // Clear the cache for all subjects after deleting some
    redisCacheClear(`subject:*`);
    // Return the deleted subjects
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteManySubjects:", error);
    // If there's an error, log it and send back an internal server error response
    next(error);
  }
};

export const deleteAllSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all subjects from the database
    const resp = await prisma.subject.deleteMany({});
    // Clear the Redis cache for all subjects
    redisCacheClear(`subject:*`);
    // Send a successful response with the deleted subjects
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    // Send an error response if something goes wrong
    next(error);
  }
};
