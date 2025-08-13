import { Router } from "express";
import { authController } from "../container";
import { validateRequest } from "../middleware/validateRequestInput.middleware";
import { createUserSchema, loginUserSchema } from "../validators/user.validator";


const router = Router();

const controller = authController;

router.post("/register", validateRequest({ body: createUserSchema }), controller.register.bind(controller));
router.post("/login", validateRequest({ body: loginUserSchema }), controller.login.bind(controller));

export default router;