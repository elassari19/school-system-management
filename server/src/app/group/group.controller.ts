import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    // Try to get the group from redis cache
    const group = await redisCacheHandler(
      `group:${req.query.id}`,
      async () =>
        // If not in cache, get from database
        await prisma.group.findUnique({
          where: {
            id: req.query.id as string,
          },
          ...option,
        })
    );

    // Return the group
    return res.status(200).send(group);
  } catch (error) {
    // Log the error
    console.log("Error", error);
    // Return the error
    next(error);
  }
};

export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    // Attempt to retrieve groups from cache
    const groups = await redisCacheHandler(
      `group:`,
      async () =>
        // If not in cache, retrieve from database
        await prisma.group.findMany({
          orderBy: { createdAt: "asc" },
          ...option,
        })
    );

    // Send the retrieved groups as a response
    return res.status(200).send(groups);
  } catch (error) {
    // Log the error and send a 500 response
    next(error);
  }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the name and tags from the request body
    const { name, tags } = req.body;

    // Create the group in the database
    const newGroup = await prisma.group.create({
      data: {
        name,
        tags,
        user: {
          // @ts-ignore
          connect: { id: req.user?.id },
        },
      },
    });

    // Add the user to the group as a member and admin
    await prisma.groupMembership.create({
      data: {
        // @ts-ignore
        userId: req.user.id,
        groupId: newGroup.id,
        isAdmin: true,
      },
    });

    // Clear the cache
    redisCacheClear("group:*");

    // Return the newly created group
    return res.status(201).send(newGroup);
  } catch (error) {
    console.log("Error", error);
    // Return the error
    return res.status(500).send({ error: error });
  }
};

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, ...rest } = req.body;

  try {
    // Update the group in the database
    const resp = await prisma.group.update({
      where: {
        // @ts-ignore
        id: req.query.id as string,
      },
      data: {
        name,
        ...rest,
      },
    });

    // Clear the cache
    redisCacheClear(`group:*`);

    // Return the updated group
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    // Return the error
    next(error);
  }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;

  try {
    // Delete the group from the database
    const resp = await prisma.group.delete({
      where: { id: id as string },
    });

    // Clear the cache
    redisCacheClear(`group:*`);

    // Return the deleted group
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    // Return the error
    next(error);
  }
};

export const deleteManyGroups = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  try {
    const resp = await prisma.group.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    redisCacheClear(`group:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};

export const deleteAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all groups from the database
    const resp = await prisma.group.deleteMany({});

    // Clear the cache
    redisCacheClear(`group:*`);

    // Return the deleted groups
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    // Return the error
    next(error);
  }
};

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user already joined
    const isJoined = await prisma.groupMembership.findFirst({
      //@ts-ignore
      where: { id: req.user.id },
    });

    if (!isJoined) {
      // Create a new group membership
      const join = await prisma.groupMembership.create({
        data: {
          //@ts-ignore
          userId: req.user.id as string,
          groupId: req.body.groupId,
          isAdmin: false,
        },
      });

      return res.status(201).send(join);
    }

    return res.status(401).json({ res: "already joined" });
  } catch (error) {
    console.log("join Error", error);
    next(error);
  }
};

export const unjoinGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user already joined
    const isJoined = await prisma.groupMembership.findFirst({
      //@ts-ignore
      where: { id: req.user.id },
    });

    // Remove user from group
    if (isJoined) {
      const join = await prisma.groupMembership.delete({
        where: {
          userId_groupId: {
            //@ts-ignore
            userId: req.user.id,
            groupId: req.body.groupId,
          },
        },
      });

      return res.status(201).send(join);
    }

    // Return an error if the user is not a member of the group
    return res.status(401).json({ res: "already joined" });
  } catch (error) {
    console.log("unjoin Error", error);
    next(error);
  }
};
