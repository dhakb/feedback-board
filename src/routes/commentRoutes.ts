import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { CommentController } from "../controllers/CommentController";
import { CommentServiceImpl } from "../services/comment/CommentServiceImpl";
import { PrismaCommentRepository } from "../infrastructure/repositories/PrismaCommentRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { createCommentSchema } from "../validators/comment.validator";
import { PrismaFeedbackRepository } from "../infrastructure/repositories/PrismaFeedbackRepository";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";


const router = Router();

const userRepo = new PrismaUserRepository();
const commentRepo = new PrismaCommentRepository();
const feedbackRepo = new PrismaFeedbackRepository();
const service = new CommentServiceImpl(commentRepo, feedbackRepo, userRepo);
const controller = new CommentController(service);

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - feedbackId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: "This is a great idea! I would love to see this feature implemented."
 *               feedbackId:
 *                 type: string
 *                 description: ID of the feedback this comment belongs to
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     content:
 *                       type: string
 *                       example: "This is a great idea! I would love to see this feature implemented."
 *                     feedbackId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
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
 *       404:
 *         description: Feedback not found
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
router.post("/", authenticate, validateRequestInput(createCommentSchema), controller.create.bind(controller));

/**
 * @swagger
 * /api/comment/{feedbackId}:
 *   get:
 *     summary: Get all comments for a feedback
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: List of comments for the feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       content:
 *                         type: string
 *                         example: "This is a great idea! I would love to see this feature implemented."
 *                       feedbackId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       userId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: "johndoe"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Feedback not found
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
router.get("/:feedbackId", authenticate, controller.findAllCommentByFeedback.bind(controller));


export default router;