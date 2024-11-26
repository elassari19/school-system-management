import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";
import { hash } from "bcryptjs";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { option } = req.body;

  if (!id) {
    return res.status(400).send("No user ID provided");
  }

  try {
    const user = await redisCacheHandler(
      `user:${id}`,
      async () =>
        await prisma.user.findUnique({
          where: { id },
          ...option,
        })
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  try {
    // Attempt to retrieve all users from cache, or database if cache is empty
    const users = await redisCacheHandler(`user:`, async () => {
      // If cache is empty, get all users from database
      const usersInDb = await prisma.user.findMany({
        ...option,
      });
      // Check for null pointer references
      if (!usersInDb) {
        throw new Error("No users found");
      }
      return usersInDb;
    });
    // Send response back to the client
    if (!users) {
      throw new Error("Error fetching users");
    }
    return res.status(200).send(users);
  } catch (error) {
    console.log("error", error);
    // If there's an error, log it and pass it down the middleware chain
    next(error);
  }
};

export const countUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { option } = req.body;
  const users = await prisma.user.count({
    ...option,
  });
  console.log("users", users);
  return res.status(200).json(users);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { password, ...rest } = req.body;

  if (!password) {
    return res.status(400).send("Password is required");
  }

  try {
    // Hash the password with the salt
    const hashPassword = await hash(password, 12);

    // Attempt to create a new user in the database
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashPassword,
      },
    });

    if (!user) {
      throw new Error("User creation failed");
    }

    // Clear the cache after creating a new user
    await redisCacheClear("user:*");

    // Return the created user back to the client
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user", error);
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).send("No user ID provided");
  }

  if (!updateData) {
    return res.status(400).send("No data provided");
  }

  try {
    // Find the existing user in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: id as string },
    });
    // If the user is not found, send a 404 response
    if (!existingUser) return res.status(404).send("Not found");

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: {
        // Use the spread operator to combine the existing user data
        // with the new data
        ...existingUser,
        ...updateData,
      },
    });
    // Clear the cache of the user
    await redisCacheClear(`user:*`);
    // Return the updated user data to the client
    return res.status(203).send(updatedUser);
  } catch (error) {
    // If there's an error, log it and pass it down the middleware chain
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;

  // Check for null pointer references
  if (!id) {
    return res.status(400).send("No user ID provided");
  }

  try {
    // Attempt to delete the user from the database
    const deleteUser = await prisma.user.delete({
      where: { id: id as string },
    });

    // Check for null pointer references
    if (!deleteUser) {
      return res.status(404).send("User not found");
    }

    // Clear the cache after deleting the user
    await redisCacheClear(`user:*`);

    // Return the deleted user data to the client
    return res.status(203).send(deleteUser);
  } catch (error) {
    console.error("Error deleting user", error);
    // Pass the error down the middleware chain
    next(error);
  }
};

export const deleteManyUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;

  // Check if IDs are provided and not empty
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("No user IDs provided");
  }

  try {
    const resp = await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    // Check if any users were deleted
    if (resp.count === 0) {
      return res.status(404).send("No users found for the provided IDs");
    }

    // Clear the cache after deleting the users
    await redisCacheClear(`user:*`);
    // Return the deleted users data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error("Error deleting users", error);
    next(error);
  }
};

export const deleteAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Attempt to delete all users from the database
    const resp = await prisma.user.deleteMany();

    // Check for null pointer references
    if (!resp) {
      return res.status(404).send("No users found");
    }

    // Clear the Redis cache for all users
    await redisCacheClear(`user:*`);
    // Return the deleted users data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error("Error deleting all users", error);
    // Pass the error down the middleware chain
    next(error);
  }
};
