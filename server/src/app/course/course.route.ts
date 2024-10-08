import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  updateCourse,
} from './course.controller';
import { isAdminOrTeacher } from '../../middelwares/passport.middelware';
import validateSchema from '../../middelwares/validateSchema';
import { courseSchema, updateCourseSchema } from './course.schema';

const router = Router();

/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get('/', getCourse);

/**
 * @swagger
 * /course/all:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.get('/all', getAllCourses);

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  // @ts-ignore
  isAdminOrTeacher(),
  validateSchema(courseSchema),
  createCourse
);

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.put(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(updateCourseSchema),
  updateCourse
);

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
// @ts-ignore
router.delete('/', isAdminOrTeacher(), deleteCourse);

export default router;
