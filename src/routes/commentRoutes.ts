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


router.post("/", authenticate, validateRequestInput(createCommentSchema), controller.create.bind(controller));
router.get("/:feedbackId", authenticate, controller.findAllCommentByFeedback.bind(controller));


export default router;