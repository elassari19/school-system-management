import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { prisma, redis } from '../../utils/configs';
import { ExtendsSessionRequest } from './auth.types';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';
import { User } from '@prisma/client';

// signUp controller
export const signUp = async (req: Request, res: Response) => {
  const { password, confirmPassword, ...rest } = req.body;
  // Check if the password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(403).json({ error: 'Password not match' });
  }
  // Hash the password with the salt
  const hashPassword = await hash(req.body.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashPassword,
      },
    });

    redisCacheClear('course:*');
    res.status(201).json(user);
  } catch (error) {
    console.log('prisma error', error);
    res.status(500).json({ error });
  }
};

// signIn controller
export const signIn = async (req: ExtendsSessionRequest, res: Response) => {
  try {
    const user = (await redisCacheHandler(
      req.body.email,
      async () =>
        await prisma.user.findUnique({
          where: { email: req.body.email },
        })
    )) as User;

    if (!user || !(await compare(req.body.password, user.password))) {
      return res.status(403).json({ error: 'Invalid email or password' });
    }
    const { password, ...rest } = user;

    req.session.user = rest;
    return res
      .status(200)
      .json({ message: 'Logged in successfully', user: rest });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// signOut controller
export const signOut = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });
  return res
    .status(200)
    .json({ success: true, message: 'Logged out successfully' });
};
