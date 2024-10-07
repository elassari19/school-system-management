import { Response, NextFunction } from 'express';
import { ExtendsSessionRequest } from '../app/auth/auth.types';

export const isAuthenticated =
  () => (req: ExtendsSessionRequest, res: Response, next: NextFunction) => {
    // using session
    // if(req.session?.user && req.session.user?.id)
    // using passport
    if (req.isAuthenticated()) {
      // console.log('req.user', req.user);
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

// Optional: Middleware to check if user is an teacher
export const isTeacher = (
  req: ExtendsSessionRequest,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  if (req?.session?.isAuthenticated && req.user?.role === 'TEACHER') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Teacher access required' });
  }
};

// Optional: Middleware to check if user is an admin or teacher
export const isAdminOrTeacher =
  () => (req: ExtendsSessionRequest, res: Response, next: NextFunction) => {
    if (
      req.isAuthenticated() && // @ts-ignore
      (req.user.role === 'ADMIN' || req.user.role === 'TEACHER')
    ) {
      // console.log('req.user', req.user);
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
