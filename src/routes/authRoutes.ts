import { Router } from "express";
import { authController } from "../container";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { createUserSchema, loginUserSchema } from "../validators/user.validator";


const router = Router();

const controller = authController;

router.post("/register", validateRequestInput(createUserSchema), controller.register.bind(controller));
router.post("/login", validateRequestInput(loginUserSchema), controller.login.bind(controller));

export default router;