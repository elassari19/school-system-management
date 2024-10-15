import { Request, RequestHandler, Router } from 'express';
import validateSchema from '../../middelwares/validateSchema';
import { signInSchema, signUpSchema } from './auth.schema';
import { signIn, signOut, signUp } from './auth.controller';
import passport from 'passport';
import '../strategies/local-strategy';

const router = Router();

/**
 * @openapi
 *  paths:
 *    /auth:
 *     post:
 *      summary: Create a new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignupInput'
 *      responses:
 *        201:
 *          description: User created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server error
 */
export const createUser = router.post(
  '/',
  validateSchema(signUpSchema),
  signUp
);

/**
 * @openapi
 *  paths:
 *    /auth/sign-in:
 *     post:
 *      summary: Sign in a user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SigninInput'
 *      responses:
 *        200:
 *          description: User signed in successfully
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Invalid email or password
 *        500:
 *          description: Server error
 */
export const signInUser = router.post(
  '/sign-in',
  validateSchema(signInSchema),
  signIn as any
);

/**
 * @swagger
 *  paths:
 *    /auth/passport/sign-in:
 *     post:
 *      summary: Sign In a user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SigninInput'
 *      responses:
 *        200:
 *          description: User signed in successfully
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Invalid email or password
 *        500:
 *          description: Server error
 */
router.post(
  '/passport/sign-in',
  validateSchema(signInSchema),
  passport.authenticate('local', { session: true }),
  (req, res) => {
    console.log('User logged in', req.user);
    res.send({ message: 'Sign in with passport', user: req.user });
  }
);

/**
 * @openapi
 *  paths:
 *    /auth/sign-out:
 *     post:
 *      summary: Sign out a user
 *      tags: [Auth]
 *      responses:
 *        200:
 *          description: User signed out successfully
 *        500:
 *          description: Server error
 */
router.get('/sign-out', signOut);

export default router;
