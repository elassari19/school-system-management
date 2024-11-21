import { Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";

// Get group by id
export const getGroup = async (req: Request, res: Response) => {
  try {
    const group = await redisCacheHandler(
      `group:${req.query.id}`,
      async () =>
        await prisma.group.findUnique({
          where: {
            id: req.query.id as string,
          },
          include: {
            memberships: true,
            admins: true,
          },
        })
    );

    return res.status(200).send(group);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ error });
  }
};

// Get all groups
export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await redisCacheHandler(
      `group:`,
      async () =>
        await prisma.group.findMany({
          orderBy: { createdAt: "asc" },
          include: {
            memberships: true,
            admins: true,
          },
        })
    );

    return res.status(200).send(groups);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

// Create a group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, tags } = req.body;

    const newGroup = await prisma.group.create({
      data: {
        name,
        tags,
        user: {
          //@ts-ignore
          connect: { id: req.user?.id },
        },
      },
    });
    // Add user to group as a member and admin
    await prisma.groupMembership.create({
      data: {
        //@ts-ignore
        userId: req.user.id,
        groupId: newGroup.id,
        isAdmin: true,
      },
    });
    redisCacheClear("group:*");
    return res.status(201).send(newGroup);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ error: error });
  }
};

// Update a group
export const updateGroup = async (req: Request, res: Response) => {
  const { name, ...rest } = req.body;

  try {
    const resp = await prisma.group.update({
      where: {
        id: req.query.id as string,
      },
      data: {
        name,
        ...rest,
      },
    });
    redisCacheClear(`group:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ error });
  }
};

// Delete a group
export const deleteGroup = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const resp = await prisma.group.delete({
      where: {
        id: req.query.id as string,
      },
    });
    redisCacheClear(`group:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ error });
  }
};

// delete many groups
export const deleteManyGroups = async (req: Request, res: Response) => {
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
    return res.status(500).send({ error });
  }
};

// delete all groups
export const deleteAllGroups = async (req: Request, res: Response) => {
  try {
    const resp = await prisma.group.deleteMany({});
    redisCacheClear(`group:*`);
    return res.status(203).send(resp);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ error });
  }
};

// join group
export const joinGroup = async (req: Request, res: Response) => {
  try {
    // check if user already joined
    const isJoined = await prisma.groupMembership.findFirst({
      //@ts-ignore
      where: { id: req.user.id },
    });

    if (!isJoined) {
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
    return res.status(500).send({ error });
  }
};

// unjoin group
export const unjoinGroup = async (req: Request, res: Response) => {
  try {
    // check if user already joined
    const isJoined = await prisma.groupMembership.findFirst({
      //@ts-ignore
      where: { id: req.user.id },
    });

    // remove user from group
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

    return res.status(401).json({ res: "already joined" });
  } catch (error) {
    console.log("unjoin Error", error);
    res.status(500).send(error);
  }
};
