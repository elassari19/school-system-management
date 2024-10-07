import { NextFunction, Request, Response } from 'express';

// error handler middelware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
  next();
};

// route not found middelware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found' });
  next();
};
