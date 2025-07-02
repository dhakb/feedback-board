import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { CommentController } from "../controllers/CommentController";
import { CommentServiceImpl } from "../services/CommentServiceImpl";
import { PrismaCommentRepository } from "../infrastructure/repositories/PrismaCommentRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { createCommentSchema } from "../validators/comment.validator";


const router = Router();

const repository = new PrismaCommentRepository();
const service = new CommentServiceImpl(repository);
const controller = new CommentController(service);


router.post("/", authenticate, validateRequestInput(createCommentSchema), controller.create.bind(controller));
router.get("/:feedbackId", authenticate, controller.findAllCommentByFeedback.bind(controller));


export default router;