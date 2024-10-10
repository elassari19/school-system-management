import { Router } from 'express';
import {
  isAdminOrTeacher,
  isAuthenticated,
} from '../../middelwares/passport.middelware';
import {
  createClass,
  deleteAllClasses,
  deleteClass,
  getAllClasses,
  getClass,
  updateClass,
} from './class.controller';
import validateSchema from '../../middelwares/validateSchema';
import { classSchema } from './class.schema';

const router = Router();

/**
 * @swagger
 * /class:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Class details
 */
router.get(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  getClass
);

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 */
router.get(
  '/all',
  // @ts-ignore
  // isAuthenticated(),
  getAllClasses
);

/**
 * @swagger
 * /class:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class created successfully
 */
router.post(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(classSchema),
  createClass
);

/**
 * @swagger
 * /class:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Class updated successfully
 */
router.put(
  '/',
  // @ts-ignore
  isAdminOrTeacher(),
  // validateSchema(updateSubjectSchema),
  updateClass
);

/**
 * @swagger
 * /class:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Class deleted successfully
 */
// @ts-ignore
router.delete('/', isAdminOrTeacher(), deleteClass);

/**
 * @swagger
 * /class/all:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 */
router.delete('/all', deleteAllClasses);

export default router;
