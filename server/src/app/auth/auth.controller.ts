import { NextFunction, Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { prisma, redis } from "../../utils/configs";
import { ExtendsSessionRequest } from "./auth.types";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";
import { User } from "@prisma/client";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { password, confirmPassword, ...rest } = req.body;

  // Check if the password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(403).json({ error: "Password not match" });
  }

  // Hash the password with the salt
  const hashPassword = await hash(req.body.password, 12);

  try {
    // Create a new user
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashPassword,
      },
    });
    // Clear the cache
    redisCacheClear("course:*");
    // Return the new user
    res.status(201).json(user);
  } catch (error) {
    console.log("prisma error", error);
    // Return a 500 error
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the user with the given email
    const user = (await redisCacheHandler(
      req.body.email,
      async () =>
        await prisma.user.findUnique({
          where: { email: req.body.email },
        })
    )) as User;

    // Check if the user exists and if the password is correct
    if (!user || !(await compare(req.body.password, user.password))) {
      // Return a 403 error
      return res.status(403).json({ error: "Invalid email or password" });
    }

    // Remove the password from the user object
    const { password, ...rest } = user;

    // @ts-ignore
    req.session.user = rest;

    // Return the user
    return res.status(200).json({ message: "Logged in successfully", user: rest });
  } catch (error) {
    // Return a 500 error
    next(error);
  }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Destroy the user's session
    req.session.destroy((err) => {
      if (err) {
        // Return a 500 error if something went wrong
        return res.status(500).json({ error: "Something went wrong" });
      }
    });

    // Return a 200 response with a success message
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    // Return a 500 error
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random token for password reset
    const token = Math.random().toString(36).substring(2);

    // Set the token in the Redis cache with an expiration time of 1 hour
    await redis.setex(`reset-password:${email}`, token, 60 * 60);

    // Send the token to the user's email
    // @ts-ignore
    // req.transporter.sendMail({
    //   from: 'Anoal School Administration',
    //   to: email,
    //   subject: 'Reset Password',
    //   text: `Your reset password token is <a href=/reset-password/?token=${token}>${token}<a>`,
    // });

    // Return a success response
    return res.status(200).json({ message: "Token sent to your email" });
  } catch (error) {
    // Return a 500 error if something went wrong
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, token, password, confirmPassword } = req.body;

  try {
    const resetToken = await redis.get(`reset-password:${email}`);
    // Check the token is valid
    if (resetToken !== token) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(403).json({ error: "Password not match" });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashPassword = await hash(password, 12);

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashPassword },
    });

    // Return a success response
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // Return a 500 error if something went wrong
    next(error);
  }
};
