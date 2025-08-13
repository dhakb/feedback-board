import { Router } from "express";
import { userController } from "../container";
import { validateRequest } from "../middleware/validateRequestInput.middleware";
import { updateUserProfileSchema } from "../validators/user.validator";
import { authenticate } from "../middleware/authenticate.middleware";


const router = Router();

const controller = userController;

router.patch("/", authenticate, validateRequest({ body: updateUserProfileSchema }), controller.updateProfile.bind(controller));

export default router;