import { Router } from 'express';
import {
  isAdminOrTeacher,
  isAuthenticated,
} from '../../middelwares/passport.middelware';
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
} from './subject.controller';
import validateSchema from '../../middelwares/validateSchema';
import {
  createManySubjectsSchema,
  createSubjectSchema,
  updateSubjectSchema,
} from './subject.schema';

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
// @ts-ignore
router.get('/', isAuthenticated(), getSubject);

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
// @ts-ignore
router.get('/all', isAuthenticated(), getAllSubjects);

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
  isAdminOrTeacher(),
  validateSchema(createSubjectSchema),
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
  '/put',
  // @ts-ignore
  isAdminOrTeacher(),
  // validateSchema(updateSubjectSchema),
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
// @ts-ignore
router.delete('/', isAdminOrTeacher(), deleteSubject);

export default router;
