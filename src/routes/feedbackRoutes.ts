import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin.middleware";
import { feedbackController } from "../container";
import { validateRequest } from "../middleware/validateRequestInput.middleware";
import {
  createFeedbackSchema,
  updateFeedbackByUserSchema,
  updateFeedbackStatusByAdminSchema,
  feedbackIdParamsSchema
} from "../validators/feedback.validator";


const router = Router();
const controller = feedbackController;

router.post("/", authenticate, validateRequest({ body: createFeedbackSchema }), controller.create.bind(controller));
router.get("/", authenticate, controller.list.bind(controller));
router.get("/:id", authenticate, validateRequest({ params: feedbackIdParamsSchema }), controller.getById.bind(controller));
router.post("/:id/upvote", authenticate, validateRequest({ params: feedbackIdParamsSchema }), controller.upvote.bind(controller));
router.delete("/:id", authenticate, validateRequest({ params: feedbackIdParamsSchema }), controller.delete.bind(controller));
router.patch("/:id", authenticate, validateRequest({ params: feedbackIdParamsSchema, body: updateFeedbackByUserSchema }), controller.updateFeedbackByUser.bind(controller));
router.patch("/:id/status", authenticate, authorizeAdmin, validateRequest({ params: feedbackIdParamsSchema, body: updateFeedbackStatusByAdminSchema }), controller.updateFeedbackStatusByAdmin.bind(controller));

export default router;
