import { Router } from "express";
import { isAdminOrTeacher, isAuthenticated } from "../../middelwares/passport.middelware";
import {
  createGroup,
  deleteAllGroups,
  deleteManyGroups,
  deleteGroup,
  getAllGroups,
  getGroup,
  updateGroup,
  joinGroup,
  unjoinGroup,
  countGroup,
} from "./group.controller";
import validateSchema from "../../middelwares/validateSchema";
import { groupSchema } from "./group.schema";

const router = Router();

/**
 * @swagger
 * /group:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
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
 *         description: Group details
 */
router.get(
  "/",
  // @ts-ignore
  // isAuthenticated(),
  getGroup
);

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all groups
 */
router.get(
  "/all",
  // @ts-ignore
  // isAuthenticated(),
  getAllGroups
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
router.get("/count", countGroup);

/**
 * @swagger
 * /group:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
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
 *               tags:
 *                 type: array
 *     responses:
 *       200:
 *         description: Group created successfully
 */
router.post(
  "/",
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(groupSchema),
  createGroup
);

/**
 * @swagger
 * /group:
 *   put:
 *     summary: Update a group
 *     tags: [Groups]
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
 *         description: Group updated successfully
 */
router.put(
  "/",
  // @ts-ignore
  // isAdminOrTeacher(),
  validateSchema(groupSchema),
  updateGroup
);

/**
 * @swagger
 * /group:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
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
 *         description: Group deleted successfully
 */
router.delete(
  "/",
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteGroup
);

/**
 * @swagger
 * /group/many:
 *   delete:
 *     summary: Delete many groups
 *     tags: [Groups]
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
  "/many",
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteManyGroups
);

/**
 * @swagger
 * /groups/all:
 *   delete:
 *     summary: Delete all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Groups deleted successfully
 */
router.delete(
  "/all",
  // @ts-ignore
  // isAdminOrTeacher(),
  deleteAllGroups
);

/**
 * @swagger
 * /groups/join:
 *   delete:
 *     summary: Delete all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             groupId:
 *               type: string
 *     responses:
 *       200:
 *         description: Groups Joined successfully
 */
router.post(
  "/join",
  // isAuthenticated(),
  joinGroup
);

/**
 * @swagger
 * /groups//unjoin:
 *   delete:
 *     summary: Unjoin group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             groupId:
 *               type: string
 *     responses:
 *       200:
 *         description: Groups Unjoin successfully
 */
router.post(
  "/unjoin",
  // isAuthenticated(),
  unjoinGroup
);

export default router;
