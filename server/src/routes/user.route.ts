import { Router } from 'express';

const router = Router();

/**
 * @openapi
 *  paths:
 *    /user:
 *     get:
 *      summary: Get user by ID or email
 *      parameters:
 *        - in: query
 *          name: id
 *          schema:
 *            type: string
 *          required: false
 *          description: The ID of the user
 *        - in: query
 *          name: email
 *          schema:
 *            type: string
 *          required: false
 *          description: The email of the user
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
 *                  email:
 *                    type: string
 *                  name:
 *                    type: string
 *        400:
 *          description: Bad Request
 *        404:
 *          description: User not found
 *        500:
 *          description: Server error
 */
export const getUser = router.get('/user', (req, res) => {
  const { id, email } = req.query;
  if (!id && !email) {
    return res.status(400).send('Either id or email must be provided');
  }
  res.send(`user with id: ${id} or email: ${email}`);
});

/**
 * @openapi
 *  paths:
 *    /users:
 *     get:
 *      summary: Get all users
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
export const getUsers = router.get('/users', (req, res) => {
  // Logic to retrieve all users
  res.send('all users');
});
