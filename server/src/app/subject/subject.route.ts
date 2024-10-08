import { Router } from 'express';
import {
  isAdminOrTeacher,
  isAuthenticated,
} from '../../middelwares/passport.middelware';
import {
  createManySubjects,
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
 * /subject/{id}:
 *   get:
 *     summary: Get a subject by ID
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
 *               createdBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject created successfully
 */
router.post(
  '/create',
  // @ts-ignore
  isAdminOrTeacher(),
  validateSchema(createSubjectSchema),
  createSubject
);

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create multiple subjects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *     responses:
 *       200:
 *         description: Subjects created successfully
 */
router.post(
  '/createMany',
  // @ts-ignore
  isAdminOrTeacher(),
  validateSchema(createManySubjectsSchema),
  createManySubjects
);

/**
 * @swagger
 * /subject/{id}:
 *   put:
 *     summary: Update a subject
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
