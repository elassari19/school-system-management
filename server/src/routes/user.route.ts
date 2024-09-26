import { Router } from 'express';
import { isAuthenticated } from '../middelwares/auth.middelware';
import passport from 'passport';

const router = Router();

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
export const getUsers = router.get(
  '/all',
  // @ts-ignore
  isAuthenticated(),
  (req, res) => {
    // Logic to retrieve all users
    res.send('all users');
  }
);

/**
 * @openapi
 *  paths:
 *    /user-delete/{userId}:
 *     delete:
 *      summary: Delete a user
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
export const deleteUser = router.delete(
  '/user-delete/:userId',
  // @ts-ignore
  isAuthenticated(),
  (req, res) => {
    const { userId } = req.params;
    // console.log('Deleting user with id:', userId);

    if (!userId) {
      return res.status(400).send('userId must be provided');
    }
    // Logic to delete a user
    res.send(`User with id: ${userId} deleted`);
  }
);

/**
 * @openapi
 *  paths:
 *    /user/:userId:
 *     get:
 *      summary: Get user by ID
 *      parameters:
 *        - in: query
 *          name: id
 *          schema:
 *            type: string
 *          required: false
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
// @ts-ignore
export const getUser = router.get('/:userId', isAuthenticated(), (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send('Either id or email must be provided');
  }
  res.send(`user with id: ${userId}`);
});

export default router;
