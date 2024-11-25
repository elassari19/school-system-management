import { Router } from "express";
import {
  countChapter,
  createChapter,
  deleteAllChapter,
  deleteChapter,
  deleteManyChapter,
  getAllChapter,
  getChapter,
  updateChapter,
} from "./chapter.controller";
import { isAdminOrTeacher } from "../../middelwares/passport.middelware";
import validateSchema from "../../middelwares/validateSchema";
import { chapterSchema } from "./chapter.schema";

const router = Router();

/**
 * @swagger
 * /chapter:
 *   get:
 *     summary: Get a chapter by ID
 *     tags: [Chapters]
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
router.get("/", getChapter);

/**
 * @swagger
 * /chapter/all:
 *   get:
 *     summary: Get all chapters
 *     tags: [Chapters]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get("/all", getAllChapter);

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
router.get("/count", countChapter);

/**
 * @swagger
 * /chapter:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChapterInput'
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(chapterSchema),
  createChapter
);

/**
 * @swagger
 * /chapter:
 *   put:
 *     summary: Update a chapter
 *     tags: [Chapters]
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
 *             $ref: '#/components/schemas/ChapterInput'
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.put(
  "/",
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(chapterSchema),
  updateChapter
);

/**
 * @swagger
 * /chapter:
 *   delete:
 *     summary: Delete a chapter
 *     tags: [Chapters]
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
 *         description: Chapter not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/",
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteChapter
);

/**
 * @swagger
 * /chapter/many:
 *   delete:
 *     summary: Delete many chapters
 *     tags: [Chapters]
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
 */ router.delete(
  "/many",
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteManyChapter
);

/**
 * @swagger
 * /chapter/all:
 *   delete:
 *     summary: Delete all chapters
 *     tags: [Chapters]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/all",
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteAllChapter
);

export default router;
