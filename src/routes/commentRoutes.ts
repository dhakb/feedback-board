import { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { commentController } from "../container";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { createCommentSchema } from "../validators/comment.validator";


const router = Router();

const controller = commentController;

router.post("/", authenticate, validateRequestInput(createCommentSchema), controller.create.bind(controller));
router.get("/:feedbackId", authenticate, controller.findAllCommentByFeedback.bind(controller));

export default router;