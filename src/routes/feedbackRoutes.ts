import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin.middleware";
import { feedbackController } from "../container";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import {
  createFeedbackSchema,
  updateFeedbackByUserSchema,
  updateFeedbackStatusByAdminSchema
} from "../validators/feedback.validator";


const router = Router();
const controller = feedbackController;

router.post("/", authenticate, validateRequestInput(createFeedbackSchema), controller.create.bind(controller));
router.get("/", authenticate, controller.list.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.post("/:id/upvote", authenticate, controller.upvote.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));
router.patch("/:id", authenticate, validateRequestInput(updateFeedbackByUserSchema), controller.updateFeedbackByUser.bind(controller));
router.patch("/:id/status", authenticate, authorizeAdmin, validateRequestInput(updateFeedbackStatusByAdminSchema), controller.updateFeedbackStatusByAdmin.bind(controller));

export default router;
