import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

// generate errorHandler middleware
export const errorHandler = async (method: Function) => {
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2001") {
          return res.status(400).json({
            message: "Bad request",
          });
        }
        if (error.code === "P2002") {
          return res.status(400).json({
            message: "Duplicate entry",
          });
        }
        if (error.code === "P2003") {
          return res.status(400).json({
            message: "Foreign key constraint failed",
          });
        }
        if (error.code === "P2025") {
          return res.status(400).json({
            message: "No record found",
          });
        }
      }
      return res.status(400).json({
        message: "Bad request",
      });
    }
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
  next();
};
