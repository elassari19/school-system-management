import { NextFunction, Request, Response } from "express";
import { prisma } from "../../utils/configs";
import { redisCacheClear, redisCacheHandler } from "../../utils/redisCache";
import { hash } from "bcryptjs";

export const getStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { query } = req.body;

  if (!id) {
    return res.status(400).send("No student ID provided");
  }

  try {
    const student = await redisCacheHandler(
      `student:${id}`,
      async () =>
        await prisma.student.findUnique({
          where: { id },
          ...query,
        })
    );

    if (!student) {
      return res.status(404).send("Student not found");
    }

    return res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  try {
    // If cache is empty, get all Students from database
    const students = await prisma.student.findMany({
      ...query,
    });
    // Check for null pointer references
    if (!students) {
      throw new Error("No students found");
    }

    // console.log("students", students);
    return res.status(200).send(students);
  } catch (error) {
    console.log("error", error);
    // If there's an error, log it and pass it down the middleware chain
    next(error);
  }
};

export const countStudents = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  const students = await prisma.student.count({
    ...query,
  });
  console.log("students", students);
  return res.status(200).json(students);
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, classId, parentId, ...data } = req.body;
  console.log("student", userId, classId, parentId);
  try {
    // Attempt to create a new Student in the database
    const student = await prisma.student.create({
      data: {
        userId,
        parentId,
        classId,
        ...data,
      },
    });

    if (!student) {
      throw new Error("Student creation failed");
    }

    // Clear the cache after creating a new student
    await redisCacheClear("student:*");

    // Return the created student back to the client
    return res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student", error);
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const updateData = req.body;

  if (!id || id == undefined || id == null) {
    return res.status(400).send("No Student ID provided");
  }

  if (!updateData) {
    return res.status(400).send("No data provided");
  }

  try {
    // Find the existing student in the database
    const existingStudent = await prisma.student.findUnique({
      where: { id: id as string },
    });
    // If the Student is not found, send a 404 response
    if (!existingStudent) return res.status(404).send("Student Not found");
    const { id: _, ...studentsWithoutId } = existingStudent;

    // Update the Student in the database
    const updatedStudent = await prisma.student.update({
      where: { id: id as string },
      data: {
        // Use the spread operator to combine the existing Student data
        // with the new data
        ...studentsWithoutId,
        ...updateData,
      },
    });
    // Clear the cache of the Student
    await redisCacheClear(`student:*`);
    // Return the updated Student data to the client
    return res.status(203).send(updatedStudent);
  } catch (err) {
    // If there's an error, log it and pass it down the middleware chain
    next(err);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;

  // Check for null pointer references
  if (!id) {
    return res.status(400).send("No student ID provided");
  }

  try {
    // Attempt to delete the student from the database
    const deleteStudent = await prisma.student.delete({
      where: { id: id as string },
    });

    // Check for null pointer references
    if (!deleteStudent) {
      return res.status(404).send("Student not found");
    }

    // Clear the cache after deleting the student
    await redisCacheClear(`student:*`);

    // Return the deleted student data to the client
    return res.status(203).send(deleteStudent);
  } catch (error) {
    console.error("Error deleting student", error);
    // Pass the error down the middleware chain
    next(error);
  }
};

export const deleteManyStudents = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;

  // Check if IDs are provided and not empty
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("No student IDs provided");
  }

  try {
    const resp = await prisma.student.deleteMany({
      where: { id: { in: ids } },
    });

    // Check if any Students were deleted
    if (resp.count === 0) {
      return res.status(404).send("No Students found for the provided IDs");
    }

    // Clear the cache after deleting the Students
    await redisCacheClear(`student:*`);
    // Return the deleted Students data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error("Error deleting Students", error);
    next(error);
  }
};

export const deleteAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  try {
    // Attempt to delete all Students from the database
    const resp = await prisma.student.deleteMany({
      ...query,
    });

    // Check for null pointer references
    if (!resp) {
      return res.status(404).send("No Students found");
    }

    // Clear the Redis cache for all Students
    await redisCacheClear(`student:*`);
    // Return the deleted Students data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error("Error deleting all Students", error);
    // Pass the error down the middleware chain
    next(error);
  }
};
