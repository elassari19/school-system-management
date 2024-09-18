import { Router } from 'express';
import { getUser } from './routes/user.route';

const router = Router();
/**
 * @openapi
 *  paths:
 *    /user:
 *     get:
 *      responses:
 *        200:
 *          description: Success
 *        500:
 *          description: Server error
 */
router.use('/v1/api/user', getUser);

export default router;
