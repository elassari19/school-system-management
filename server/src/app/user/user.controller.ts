import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { query } = req.body;
  if (!id) {
    return res.status(400).send("No user ID provided");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      ...query,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  console.log("query", query);
  try {
    // If cache is empty, get all users from database
    const users = await prisma.user.findMany({
      ...query,
    });
    // Check for null pointer references
    if (!users) {
      throw new Error("No users found");
    }

    // console.log("users", users);
    return res.status(200).send(users);
  } catch (error) {
    console.log("error", error);
    // If there's an error, log it and pass it down the middleware chain
    next(error);
  }
};

export const countUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  const users = await prisma.user.count({
    ...query,
  });
  console.log("users", users);
  return res.status(200).json(users);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { password, image, ...rest } = req.body;

  const existUser = await prisma.user.findUnique({
    where: { email: rest.email },
  });
  if (existUser) {
    return res.status(302).send("User already exist");
  }

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
        image: faker.image.avatar(),
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
  const { password, ...updateData } = req.body;

  if (!id || id == undefined || id == null) {
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
    if (!existingUser) return res.status(404).send("User Not found");
    const { id: _, ...userWithoutId } = existingUser;

    // If the password is provided, hash it with the salt
    if (password !== undefined && password !== null && password !== "") {
      const hashPassword = await hash(password, 12);
      updateData.password = hashPassword;
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: {
        // Use the spread operator to combine the existing user data
        // with the new data
        ...userWithoutId,
        ...updateData,
        password: userWithoutId.password,
      },
    });
    // Clear the cache of the user
    await redisCacheClear(`user:*`);
    // Return the updated user data to the client
    return res.status(203).send(updatedUser);
  } catch (err) {
    // If there's an error, log it and pass it down the middleware chain
    next(err);
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
