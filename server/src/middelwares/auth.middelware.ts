// src/utils/middlewares.ts

import { Response, NextFunction } from 'express';
import { ExtendsSessionRequest } from '../types/auth.types';

export const isAuthenticated =
  () => (req: ExtendsSessionRequest, res: Response, next: NextFunction) => {
    if (req.session?.user && req.session.user?.id) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

export const isNotAuthenticated =
  () => (req: ExtendsSessionRequest, res: Response, next: NextFunction) => {
    if (req?.session && !req.session.isAuthenticated) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: You are already logged in' });
    }
  };

export const setAuthUser =
  () => (req: ExtendsSessionRequest, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
      // You can fetch user details from the database here if needed
      // For now, we'll just set a flag
      res.locals.user = { id: req.session.user };
    }
    next();
  };

// Optional: Middleware to check if user is an admin
export const isAdmin = (
  req: ExtendsSessionRequest,
  res: Response,
  next: NextFunction
) => {
  if (req?.session?.isAuthenticated && res?.locals?.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};
