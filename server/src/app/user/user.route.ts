import { Router } from 'express';
import { isAuthenticated } from '../../middelwares/passport.middelware';
import {
  createUser,
  deleteAllUsers,
  deleteManyUsers,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './user.controller';
import validateSchema from '../../middelwares/validateSchema';
import { userSchema } from './user.schema';

const router = Router();

/**
 * @openapi
 *  paths:
 *    /user/:
 *     get:
 *      summary: Get user by ID
 *      tags: [Users]
 *      parameters:
 *        - in: query
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the user
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *        400:
 *          description: Bad Request
 *        404:
 *          description: User not found
 *        500:
 *          description: Server error
 */
router.get(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  getUser
);

/**
 * @openapi
 *  paths:
 *    /users:
 *     get:
 *      summary: Get all users
 *      tags: [Users]
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    email:
 *                      type: string
 *                    name:
 *                      type: string
 *        500:
 *          description: Server error
 */
router.get(
  '/all',
  // @ts-ignore
  // isAuthenticated(),
  getAllUsers
);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Subject created successfully
 */
router.post(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  validateSchema(userSchema),
  createUser
);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Subject created successfully
 */
router.put(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  validateSchema(userSchema),
  updateUser
);

/**
 * @openapi
 *  paths:
 *    /user:
 *     delete:
 *      summary: Delete a user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: User deleted successfully
 *        400:
 *          description: Bad Request
 *        404:
 *          description: User not found
 *        500:
 *          description: Server error
 */
router.delete(
  '/',
  // @ts-ignore
  // isAuthenticated(),
  deleteUser
);

/**
 * @swagger
 * /user/many:
 *   delete:
 *     summary: Delete many users
 *     tags: [Users]
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
  // isAuthenticated(),
  deleteManyUsers
);

/**
 * @swagger
 * /user/all:
 *   delete:
 *     summary: Delete all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/all',
  // @ts-ignore
  // isAuthenticated(),
  deleteAllUsers
);

export default router;
