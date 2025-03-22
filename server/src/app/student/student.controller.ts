import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../utils/configs';
import { redisCacheClear, redisCacheHandler } from '../../utils/redisCache';
import { hash } from 'bcryptjs';

export const getStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { query } = req.body;

  if (!id) {
    return res.status(400).send('No student ID provided');
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      ...query,
    });

    if (!student) {
      return res.status(404).send('Student not found');
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
      throw new Error('No students found');
    }

    // console.log("students", students);
    return res.status(200).send(students);
  } catch (error) {
    console.log('error', error);
    // If there's an error, log it and pass it down the middleware chain
    next(error);
  }
};

export const countStudents = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.body;
  const students = await prisma.student.count({
    ...query,
  });
  console.log('students', students);
  return res.status(200).json(students);
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, classId, parentId, ...data } = req.body;
  console.log('student', userId, classId, parentId);
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
      throw new Error('Student creation failed');
    }

    // Clear the cache after creating a new student
    await redisCacheClear('student:*');

    console.log('created student', student);
    // Return the created student back to the client
    return res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student', error);
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  const { parentId, classId } = req.body;

  if (!id) {
    return res.status(400).send('No Student ID provided');
  }

  try {
    // Find the existing student in the database with full relations
    const existingStudent = await prisma.student.findUnique({
      where: { id: id as string },
      include: {
        parent: {
          include: {
            user: true,
          },
        },
        class: true,
        user: true,
      },
    });

    if (!existingStudent) {
      return res.status(404).send('Student Not found');
    }

    // Verify if the parent exists before updating
    const parentExists = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        user: true,
      },
    });

    if (parentId && !parentExists) {
      console.log('Parent not found');
      return res.status(404).send('Parent Not found');
    }

    // Update the Student in the database with relations
    const updatedStudent = await prisma.student.update({
      where: { id: id as string },
      data: {
        ...(parentId && { parentId }),
        ...(classId && { classId }),
      },
      include: {
        parent: {
          include: {
            user: true,
          },
        },
        class: true,
        user: true,
      },
    });

    await redisCacheClear(`student:*`);
    return res.status(200).send(updatedStudent);
  } catch (err) {
    console.error('Error updating student:', err);
    next(err);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('No student ID provided');
  }

  try {
    // First find the student to get the userId
    const student = await prisma.student.findUnique({
      where: { id: id as string },
    });

    if (!student) {
      console.log('Student not found');
      return res.status(404).send('Student not found');
    }

    // Use transaction to delete both student and user
    const deleteResult = await prisma.$transaction(async (tx) => {
      // Delete student first (due to foreign key constraint)
      await tx.user.delete({
        where: { id: id as string },
      });

      // Then delete the associated user
      return await tx.user.delete({
        where: { id: student.userId },
      });
    });

    // Clear the cache after successful deletion
    await redisCacheClear(`student:*`);
    await redisCacheClear(`user:*`);

    console.log('delete student', deleteResult);
    return res.status(200).send({ message: 'Student and user data deleted successfully' });
  } catch (error) {
    console.error('Error deleting student and user:', error);
    next(error);
  }
};

export const deleteManyStudents = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;

  // Check if IDs are provided and not empty
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send('No student IDs provided');
  }

  try {
    const resp = await prisma.student.deleteMany({
      where: { id: { in: ids } },
    });

    // Check if any Students were deleted
    if (resp.count === 0) {
      return res.status(404).send('No Students found for the provided IDs');
    }

    // Clear the cache after deleting the Students
    await redisCacheClear(`student:*`);
    // Return the deleted Students data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error('Error deleting Students', error);
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
      return res.status(404).send('No Students found');
    }

    // Clear the Redis cache for all Students
    await redisCacheClear(`student:*`);
    // Return the deleted Students data to the client
    return res.status(203).send(resp);
  } catch (error) {
    console.error('Error deleting all Students', error);
    // Pass the error down the middleware chain
    next(error);
  }
};
