import { NextFunction, Request, Response } from "express";
import { prisma, redis } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";
import { Chapter } from "@prisma/client";

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { option } = req.body;
  try {
    const resp = await redisCacheHandler(
      `content:${id}`,
      async () =>
        await prisma.content.findUnique({
          where: {
            id: id as string,
          },
          ...option,
        })
    );
    return res.status(200).send(resp);
  } catch (error) {
    console.log("Error in getContent:", error);
    next(error);
  }
};

export const getAllChapterContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chapterId } = req.query;
  const { option } = req.body;
  try {
    // Get all contents of a chapter from cache, or database if cache is empty
    const resp = await redisCacheHandler(
      `content:${chapterId}`,
      async () =>
        await prisma.content.findMany({
          where: {
            chapterId: chapterId as string,
          },
          ...option,
        })
    );

    // Return the contents
    return res.status(200).send(resp);
  } catch (error) {
    console.log("Error in getCourse:", error);
    // Send back internal server error
    next(error);
  }
};

export const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    // Fetch all content from cache, or database if cache is empty
    const resp = await redisCacheHandler(
      "content:",
      async () =>
        await prisma.content.findMany({
          ...option,
        })
    );

    // Send the response back to the client
    return res.status(200).send(resp);
  } catch (error) {
    // Log error and send back internal server error
    console.log("Error in getAllContent:", error);
    next(error);
  }
};

export const createContent = async (req: Request, res: Response, next: NextFunction) => {
  const { title, type, data } = req.body;
  const { chapterId } = req.query;

  try {
    const chapter = async () =>
      await prisma.chapter.findUnique({
        where: {
          id: chapterId as string,
        },
      });
    if (!chapter) {
      return res.status(404).send("Chapter not found");
    }
    const resp = await prisma.content.create({
      data: {
        type,
        title,
        data,
        chapter: { connect: { id: chapterId as string } },
      },
    });
    // Clear the cache of all content
    redisCacheClear("content:*");
    return res.status(201).send(resp);
  } catch (error) {
    console.log("Error in createContent:", error);
    // Send back internal server error
    return next(error);
  }
};

export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;

  try {
    // Check if the content exists in the database
    const content = await prisma.content.findUnique({
      where: {
        id: id as string,
      },
    });
    if (!content) {
      // Clear the cache of all content
      redisCacheClear("content:*");
      return res.status(404).send("Content not found");
    }

    // Update the content
    const resp = await prisma.content.update({
      where: {
        id: id as string,
      },
      data: req.body,
    });
    // Clear the cache of all content
    redisCacheClear("content:*");
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in updateContent:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  try {
    // First, check if the content exists
    const content = await prisma.content.findUnique({
      where: {
        id: id as string,
      },
    });
    if (!content) {
      // Clear the cache of all content
      redisCacheClear("content:*");
      return res.status(404).send("Content not found");
    }
    // Delete the content
    const resp = await prisma.content.delete({
      where: {
        id: id as string,
      },
    });
    // Clear the cache of all content
    redisCacheClear("content:*");
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteContent:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteChapterContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chapterId } = req.query;
  try {
    // First, find the chapter
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId as string },
    });
    if (!chapter) {
      // Clear the cache of all content
      redisCacheClear("content:*");
      return res.status(404).send("Chapter not found");
    }
    // Delete all content associated with the chapter
    const resp = await prisma.content.deleteMany({
      where: {
        chapterId: chapterId as string,
      },
    });
    // Clear the cache of all content
    redisCacheClear("content:*");
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteContent:", error);
    // Send back internal server error
    next(error);
  }
};

export const deleteManyContent = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;

  try {
    // Delete all content associated with the IDs
    const resp = await prisma.content.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    // Clear the cache of all content
    redisCacheClear("content:*");
    // Send the response back to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteContent:", error);
    // Log the error and send back internal server error
    return next(error);
  }
};

export const deleteAllContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all content associated with the IDs
    const resp = await prisma.content.deleteMany({});
    // Clear the cache of all content
    redisCacheClear("content:*");
    // Send the response back to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error in deleteAllContent:", error);
    // Log the error and send back internal server error
    next(error);
  }
};
