import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { commentController } from "../container";
import { validateRequest } from "../middleware/validateRequestInput.middleware";
import { createCommentSchema, feedbackIdParamsSchema } from "../validators/comment.validator";


const router = Router();

const controller = commentController;

router.post("/", authenticate, validateRequest({ body: createCommentSchema }), controller.create.bind(controller));
router.get("/:feedbackId", authenticate, validateRequest({ params: feedbackIdParamsSchema }), controller.findAllCommentByFeedback.bind(controller));

export default router;