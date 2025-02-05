import { Router } from 'express';
import { isAdminOrTeacher, isAuthenticated } from '../../middelwares/passport.middelware';
import {
  countSubject,
  createSubject,
  deleteAllSubjects,
  deleteManySubjects,
  deleteSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
} from './subject.controller';
import validateSchema from '../../middelwares/validateSchema';
import { subjectSchema } from './subject.schema';

const router = Router();

/**
 * @swagger
 * /subject:
 *   POST:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
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
 *         description: Subject details
 */
router.post(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  getSubject
);

/**
 * @swagger
 * /subjects:
 *   POST:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subjects
 */
router.post(
  '/all',
  // @ts-ignore
  // isAuthenticated(),
  getAllSubjects
);

/**
 * @openapi
 *  paths:
 *    /users:
 *     get:
 *      summary: Get all users
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      responses:
 *        200:
 *          description: Success
 *        500:
 *          description: Server error
 */
router.get('/count', countSubject);

/**
 * @swagger
 * /subject:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
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
 *         description: Subject created successfully
 */
router.post(
  '/create',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(subjectSchema),
  createSubject
);

/**
 * @swagger
 * /subject:
 *   put:
 *     summary: Update a subject
 *     tags: [Subjects]
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
 *         description: Subject updated successfully
 */
router.put(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(subjectSchema),
  updateSubject
);

/**
 * @swagger
 * /subject:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
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
 *         description: Subject deleted successfully
 */
router.delete(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteSubject
);

/**
 * @swagger
 * /subject/many:
 *   delete:
 *     summary: Delete many subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/many',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteManySubjects
);

/**
 * @swagger
 * /subjects:
 *   delete:
 *     summary: Delete all subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subjects deleted successfully
 */
router.delete(
  '/all',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteAllSubjects
);

export default router;
