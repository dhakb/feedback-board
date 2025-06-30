import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthServiceImpl } from "../services/AuthServiceImpl";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";


const router = Router();

const repository = new PrismaUserRepository();
const service = new AuthServiceImpl(repository);
const controller = new AuthController(service);

router.post("/register", controller.register.bind(controller));
router.post("/login", controller.login.bind(controller));

export default router;