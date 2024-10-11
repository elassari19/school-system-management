import { Router } from 'express';
import {
  createContent,
  deleteAllContent,
  deleteChapterContent,
  deleteContent,
  deleteManyContent,
  getAllChapterContent,
  getAllContent,
  getContent,
  updateContent,
} from './content.controller';
import { isAdminOrTeacher } from '../../middelwares/passport.middelware';
import validateSchema from '../../middelwares/validateSchema';
import { contentSchema } from './content.schema';

const router = Router();

/**
 * @swagger
 * /content:
 *   get:
 *     summary: Get a content by ID
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/', getContent);

/**
 * @swagger
 * /content/chapter:
 *   get:
 *     summary: Get chapter content
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/chapter', getAllChapterContent);

/**
 * @swagger
 * /content/all:
 *   get:
 *     summary: Get all content
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/all', getAllContent);

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Create a new content
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(contentSchema),
  createContent
);

/**
 * @swagger
 * /content:
 *   put:
 *     summary: Update a content
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentInput'
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.put(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(contentSchema),
  updateContent
);

/**
 * @swagger
 * /content:
 *   delete:
 *     summary: Delete a content
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteContent
);

/**
 * @swagger
 * /content/chapter:
 *   delete:
 *     summary: Delete chapter content
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/chapter',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteChapterContent
);

/**
 * @swagger
 * /content/many:
 *   delete:
 *     summary: Delete many contents
 *     tags: [Contents]
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
 */ router.delete(
  '/many',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteManyContent
);

/**
 * @swagger
 * /content/all:
 *   delete:
 *     summary: Delete all content
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/all',
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteAllContent
);

export default router;
