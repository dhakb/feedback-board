import { Router } from "express";
import { FeedbackController } from "../controllers/FeedbackController";
import { FeedbackServiceImpl } from "../services/FeedbackServiceImpl";
import { PrismaFeedbackRepository } from "../infrastructure/repositories/PrismaFeedbackRepository";


const router = Router();
const repository = new PrismaFeedbackRepository();
const service = new FeedbackServiceImpl(repository);
const controller = new FeedbackController(service);

router.post("/", controller.create.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/:id/upvote", controller.upvote.bind(controller));

export default router;
