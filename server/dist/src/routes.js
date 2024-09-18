"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("./routes/user.route");
const router = (0, express_1.Router)();
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
router.use('/v1/api/user', user_route_1.getUser);
exports.default = router;
