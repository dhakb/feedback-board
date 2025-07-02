import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthServiceImpl } from "../services/AuthServiceImpl";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { createUserSchema, loginUserSchema } from "../validators/user.validator";


const router = Router();

const repository = new PrismaUserRepository();
const service = new AuthServiceImpl(repository);
const controller = new AuthController(service);

router.post("/register", validateRequestInput(createUserSchema), controller.register.bind(controller));
router.post("/login", validateRequestInput(loginUserSchema), controller.login.bind(controller));

export default router;