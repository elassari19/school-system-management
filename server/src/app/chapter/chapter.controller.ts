import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";

export const getChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { option } = req.body;
  try {
    /**
     * Get the chapter from the cache, or the database if the cache is empty
     */
    const resp = await redisCacheHandler(
      `chapter:${id}`,
      async () =>
        await prisma.chapter.findUnique({
          where: {
            id: id as string,
          },
          ...option,
        })
    );
    return res.status(200).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    next(error);
  }
};

export const getAllChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;

  try {
    // Get the chapters from the cache, or the database if the cache is empty
    const resp = await redisCacheHandler(
      "chapter:",
      async () =>
        await prisma.chapter.findMany({
          ...option,
        })
    );

    return res.status(200).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    next(error);
  }
};

export const countChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  const count = await prisma.chapter.count({
    ...option,
  });
  return res.status(200).send(count);
};

export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, duration } = req.body;

  try {
    // Create a new chapter in the database
    const resp = await prisma.chapter.create({
      data: {
        title,
        description,
        duration, // @ts-ignore
        course: { connect: { id: req.query?.courseId } },
      },
    });
    // Clear the cache for all chapters
    redisCacheClear("chapter:*");
    // Send a successful response with the created chapter
    return res.status(201).send(resp);
  } catch (error) {
    console.log("Error in createChapter:", error);
    // Send back internal server error
    return next(error);
  }
};

export const updateChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, duration } = req.body;
  const { id } = req.query;

  try {
    // Update the chapter in the database
    const resp = await redisCacheHandler(
      `chapter:${id}`,
      async () =>
        await prisma.chapter.update({
          where: {
            id: id as string,
          },
          data: {
            title,
            description,
            duration,
          },
        })
    );
    // Clear the cache for all chapters
    redisCacheClear("chapter:*");
    // Send a successful response with the updated chapter
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in updateChapter:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  try {
    // Delete the chapter in the database
    const resp = await prisma.chapter.delete({
      where: {
        id: id as string,
      },
    });
    // Clear the cache for all chapters
    redisCacheClear("chapter:*");
    // Send a successful response with the deleted chapter
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteChapter:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteManyChapter = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  try {
    // Delete the chapters with the given IDs
    const resp = await prisma.chapter.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    // Clear the Redis cache for all chapters
    redisCacheClear("chapter:*");
    // Send a successful response with the deleted chapters
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteChapter:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteAllChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all chapters from the database
    const resp = await prisma.chapter.deleteMany({});
    // Clear the Redis cache for all chapters
    redisCacheClear("chapter:*");
    // Send a successful response with the deleted chapters
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteAllChapter:", error);
    // Send back internal server error
    next(error);
  }
};
