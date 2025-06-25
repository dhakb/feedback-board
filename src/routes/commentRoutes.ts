import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { CommentServiceImpl } from "../services/CommentServiceImpl";
import { PrismaCommentRepository } from "../infrastructure/repositories/PrismaCommentRepository";


const router = Router();

const repository = new PrismaCommentRepository();
const service = new CommentServiceImpl(repository);
const controller = new CommentController(service);


router.post("/", controller.create.bind(controller));
router.get("/:feedbackId", controller.findAllCommentByFeedback.bind(controller));


export default router;