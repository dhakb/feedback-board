import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin.middleware";
import { FeedbackController } from "../controllers/FeedbackController";
import { FeedbackServiceImpl } from "../services/feeback/FeedbackServiceImpl";
import { PrismaFeedbackRepository } from "../infrastructure/repositories/PrismaFeedbackRepository";
import { PrismaFeedbackVoteRepository } from "../infrastructure/repositories/PrismaFeedbackVoteRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import {
  createFeedbackSchema,
  updateFeedbackByUserSchema,
  updateFeedbackStatusByAdminSchema
} from "../validators/feedback.validator";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";


const router = Router();
const userRepository = new PrismaUserRepository();
const feedbackRepository = new PrismaFeedbackRepository();
const feedbackVoteRepository = new PrismaFeedbackVoteRepository();
const service = new FeedbackServiceImpl(feedbackRepository, feedbackVoteRepository, userRepository);
const controller = new FeedbackController(service);

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Feedback title
 *                 example: "Add dark mode"
 *               description:
 *                 type: string
 *                 description: Feedback description
 *                 example: "Please add a dark mode option to the application"
 *               category:
 *                 type: string
 *                 enum: [FEATURE, BUG, IMPROVEMENT]
 *                 description: Feedback category
 *                 example: "FEATURE"
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback created successfully"
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "Add dark mode"
 *                     description:
 *                       type: string
 *                       example: "Please add a dark mode option to the application"
 *                     category:
 *                       type: string
 *                       example: "FEATURE"
 *                     status:
 *                       type: string
 *                       example: "PENDING"
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authenticate, validateRequestInput(createFeedbackSchema), controller.create.bind(controller));

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback items
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [FEATURE, BUG, IMPROVEMENT]
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of feedback items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       status:
 *                         type: string
 *                       upvotes:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *       401:
 *         description: Unauthorized - invalid token
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
router.get("/", authenticate, controller.list.bind(controller));

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     status:
 *                       type: string
 *                     upvotes:
 *                       type: number
 *                     userId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Feedback not found
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticate, controller.getById.bind(controller));

/**
 * @swagger
 * /api/feedback/{id}/upvote:
 *   post:
 *     summary: Upvote a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback upvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback upvoted successfully"
 *       404:
 *         description: Feedback not found
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
 *         description: User already upvoted this feedback
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
router.post("/:id/upvote", authenticate, controller.upvote.bind(controller));

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback deleted successfully"
 *       404:
 *         description: Feedback not found
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
 *       403:
 *         description: Forbidden - user can only delete their own feedback
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
router.delete("/:id", authenticate, controller.delete.bind(controller));

/**
 * @swagger
 * /api/feedback/{id}:
 *   patch:
 *     summary: Update feedback by user
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Feedback title
 *                 example: "Updated title"
 *               description:
 *                 type: string
 *                 description: Feedback description
 *                 example: "Updated description"
 *               category:
 *                 type: string
 *                 enum: [FEATURE, BUG, IMPROVEMENT]
 *                 description: Feedback category
 *                 example: "FEATURE"
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback updated successfully"
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: Feedback not found
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
 *       403:
 *         description: Forbidden - user can only update their own feedback
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
router.patch("/:id", authenticate, validateRequestInput(updateFeedbackByUserSchema), controller.updateFeedbackByUser.bind(controller));

/**
 * @swagger
 * /api/feedback/{id}/status:
 *   patch:
 *     summary: Update feedback status (Admin only)
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *                 description: New feedback status
 *                 example: "IN_PROGRESS"
 *     responses:
 *       200:
 *         description: Feedback status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback status updated successfully"
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: Feedback not found
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
 *       403:
 *         description: Forbidden - admin access required
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
router.patch("/:id/status", authenticate, authorizeAdmin, validateRequestInput(updateFeedbackStatusByAdminSchema), controller.updateFeedbackStatusByAdmin.bind(controller));


export default router;
