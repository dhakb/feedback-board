import { Router } from "express";
import {authenticate} from "../middleware/authenticate.middleware";
import { FeedbackController } from "../controllers/FeedbackController";
import { FeedbackServiceImpl } from "../services/FeedbackServiceImpl";
import { PrismaFeedbackRepository } from "../infrastructure/repositories/PrismaFeedbackRepository";


const router = Router();
const repository = new PrismaFeedbackRepository();
const service = new FeedbackServiceImpl(repository);
const controller = new FeedbackController(service);

router.post("/", authenticate, controller.create.bind(controller));
router.get("/", authenticate, controller.list.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.post("/:id/upvote", authenticate, controller.upvote.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;
