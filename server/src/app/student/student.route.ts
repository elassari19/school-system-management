import { Router } from "express";
import { isAuthenticated } from "../../middelwares/passport.middelware";
import {
  countStudents,
  createStudent,
  deleteAllStudents,
  deleteManyStudents,
  deleteStudent,
  getAllStudents,
  getStudent,
  updateStudent,
} from "./student.controller";
import validateSchema from "../../middelwares/validateSchema";
import { studentSchema } from "./student.schema";

const router = Router();

/**
 * @openapi
 *  paths:
 *    /student/:
 *     get:
 *      summary: Get student by ID
 *      tags: [Students]
 *      parameters:
 *        - in: query
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the student
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
 *          description: Student not found
 *        500:
 *          description: Server error
 */
router.post(
  "/",
  // @ts-ignore
  // isAuthenticated(),
  getStudent
);

/**
 * @openapi
 *  paths:
 *    /students:
 *     get:
 *      summary: Get all students
 *      tags: [Students]
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
router.post(
  "/all",
  // @ts-ignore
  // isAuthenticated(),
  getAllStudents
);

/**
 * @openapi
 *  paths:
 *    /students:
 *     get:
 *      summary: Get all students
 *      tags: [Students]
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
router.post("/count", countStudents);

/**
 * @swagger
 *  /student:
 *    post:
 *      summary: Create a new student
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StudentInput'
 *      responses:
 *        200:
 *          description: Subject created successfully
 */
router.post(
  "/",
  // @ts-ignore
  // isAuthenticated(),
  validateSchema(studentSchema),
  createStudent
);

/**
 * @swagger
 *  /student:
 *    post:
 *      summary: Create a new student
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            $ref:
 *              '#/components/schemas/StudentInput'
 *      responses:
 *        200:
 *          description: Subject created successfully
 */
router.put(
  "/",
  // @ts-ignore
  // isAuthenticated(),
  validateSchema(studentSchema),
  updateStudent
);

/**
 * @openapi
 *  paths:
 *    /student:
 *     delete:
 *      summary: Delete a student
 *      tags: [Students]
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Student deleted successfully
 *        400:
 *          description: Bad Request
 *        404:
 *          description: Student not found
 *        500:
 *          description: Server error
 */
router.delete(
  "/",
  // @ts-ignore
  // isAuthenticated(),
  deleteStudent
);

/**
 * @swagger
 * /student/many:
 *   delete:
 *     summary: Delete many students
 *     tags: [Students]
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
  // isAuthenticated(),
  deleteManyStudents
);

/**
 * @swagger
 * /student/all:
 *   delete:
 *     summary: Delete all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/all",
  // @ts-ignore
  // isAuthenticated(),
  deleteAllStudents
);

export default router;
