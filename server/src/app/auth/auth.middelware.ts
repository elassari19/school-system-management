import { Response, NextFunction } from 'express';
import { ExtendsSessionRequest } from './auth.types';

export const setAuthUser =
  () => (req: ExtendsSessionRequest, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
      // You can fetch user details from the database here if needed
      // For now, we'll just set a flag
      res.locals.user = req.session.user;
    }
    next();
  };
