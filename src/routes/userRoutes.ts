import { Router } from "express";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { validateRequestInput } from "../middleware/validateRequestInput.middleware";
import { updateUserProfileSchema } from "../validators/user.validator";
import { UserServiceImpl } from "../services/UserService";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middleware/authenticate.middleware";


const router = Router();

const repository = new PrismaUserRepository();
const service = new UserServiceImpl(repository);
const controller = new UserController(service);

router.patch("/", authenticate, validateRequestInput(updateUserProfileSchema), controller.updateProfile.bind(controller));

export default router;