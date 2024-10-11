import { Router } from 'express';
import {
  isAdminOrTeacher,
  isAuthenticated,
} from '../../middelwares/passport.middelware';
import {
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
 *   get:
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
router.get(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  getSubject
);

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subjects
 */
router.get(
  '/all',
  // @ts-ignore
  // isAuthenticated(),
  getAllSubjects
);

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
  '/',
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
 *          items:
 *            type: string
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
