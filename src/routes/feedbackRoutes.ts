import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin.middleware";
import { FeedbackController } from "../controllers/FeedbackController";
import { FeedbackServiceImpl } from "../services/FeedbackServiceImpl";
import { PrismaFeedbackRepository } from "../infrastructure/repositories/PrismaFeedbackRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import {
  createFeedbackSchema,
  updateFeedbackByUserSchema,
  updateFeedbackStatusByAdminSchema
} from "../validators/feedback.validator";


const router = Router();
const repository = new PrismaFeedbackRepository();
const service = new FeedbackServiceImpl(repository);
const controller = new FeedbackController(service);

router.post("/", authenticate, validateRequestInput(createFeedbackSchema), controller.create.bind(controller));
router.get("/", authenticate, controller.list.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.post("/:id/upvote", authenticate, controller.upvote.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));
router.patch("/:id", authenticate, validateRequestInput(updateFeedbackByUserSchema), controller.updateFeedbackByUser.bind(controller));
router.patch("/:id/status", authenticate, authorizeAdmin, validateRequestInput(updateFeedbackStatusByAdminSchema), controller.updateFeedbackStatusByAdmin.bind(controller));


export default router;
