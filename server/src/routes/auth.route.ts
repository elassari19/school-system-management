import { Request, RequestHandler, Router } from 'express';
import validateSchema from '../middelwares/validateSchema';
import { signInSchema, signUpSchema } from '../joiValidation/auth.joi';
import { signIn, signOut, signUp } from '../controllers/auth.controller';
import { isAuthenticated } from '../middelwares/auth.middelware';
import passport from 'passport';
import '../strategies/local-strategy';

const router = Router();

/**
 * @openapi
 *  paths:
 *    /user/create:
 *     post:
 *      summary: Create a new user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                email:
 *                  type: string
 *                name:
 *                  type: string
 *      responses:
 *        201:
 *          description: User created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server error
 */
export const createUser = router.post(
  '/sign-up',
  validateSchema(signUpSchema),
  signUp
);

/**
 * @openapi
 *  paths:
 *    /user/sign-in:
 *     post:
 *      summary: Sign in a user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
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

export const signInUserWithPassport = router.post(
  '/passport/sign-in',
  validateSchema(signInSchema),
  passport.authenticate('local', { session: true }),
  (req, res) => {
    console.log('User logged in', req.user);
    res.send('Sign in with passport');
  }
);

/**
 * @openapi
 *  paths:
 *    /user/sign-out:
 *     post:
 *      summary: Sign out a user
 *      responses:
 *        200:
 *          description: User signed out successfully
 *        500:
 *          description: Server error
 */
export const signOutUser = router.get(
  '/sign-out',
  isAuthenticated() as any,
  signOut
);

export default router;
