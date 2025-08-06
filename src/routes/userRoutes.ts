import { Router } from "express";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { updateUserProfileSchema } from "../validators/user.validator";
import { UserServiceImpl } from "../services/user/UserServiceImpl";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middleware/authenticate.middleware";


const router = Router();

const repository = new PrismaUserRepository();
const service = new UserServiceImpl(repository);
const controller = new UserController(service);

/**
 * @swagger
 * /api/user:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username
 *                 example: "newusername"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: New email address
 *                 example: "newemail@example.com"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/", authenticate, validateRequestInput(updateUserProfileSchema), controller.updateProfile.bind(controller));

export default router;