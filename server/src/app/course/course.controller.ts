import { NextFunction, Request, Response } from "express";
import { prisma, redis } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { option } = req.body;

  try {
    // Get the course from the cache if it exists
    const cachedCourse = await redisCacheHandler(`course:${id}`, async () => {
      // If the cache doesn't exist, get the course from the database
      return await prisma.course.findUnique({
        where: {
          id: id as string,
        },
        ...option,
      });
    });

    // Return the course
    return res.status(200).send(cachedCourse);
  } catch (error) {
    console.log("Error in getCourse:", error);
    next(error);
  }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get all courses from cache, or database if cache is empty
    const resp = await redisCacheHandler(
      "course:",
      // If cache is empty, get all courses from database
      async () => await prisma.course.findMany()
    );

    // Send response back to the client
    return res.status(200).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};

export const countCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  const count = await prisma.course.count({
    ...option,
  });
  return res.status(200).json(count);
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { subjectId, ...cours } = req.body;

  try {
    // Create a new course in the database
    const resp = await prisma.course.create({
      data: {
        ...cours, // @ts-ignore
        user: { connect: { id: req.user?.id } },
        subject: { connect: { id: subjectId } },
        chapters: { create: req.body.chapters },
      },
    });
    // Clear the cache for courses
    redisCacheClear("course:*");
    // Return the course
    return res.status(201).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { ...updateCourse } = req.body;
  const { id } = req.query;

  try {
    // Update the course in the database
    const resp = await prisma.course.update({
      where: {
        id: id as string,
      },
      data: {
        ...updateCourse,
      },
    });
    // Clear the cache for courses
    redisCacheClear(`course:*`);
    // Return the updated course
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  try {
    const resp = await prisma.course.delete({
      where: {
        // Delete the course by its ID
        id: id as string,
      },
    });
    // Clear the cache for courses
    redisCacheClear(`course:*`);
    // Return the deleted course
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteManyCourses = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.course.deleteMany({
      where: {
        // Delete the courses by their IDs
        id: {
          in: ids,
        },
      },
    });
    // Clear the cache for courses
    redisCacheClear(`course:*`);
    // Return the deleted courses
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all courses
    const resp = await prisma.course.deleteMany({});
    // Clear the cache for courses
    redisCacheClear(`course:*`);
    // Return the deleted courses
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};
