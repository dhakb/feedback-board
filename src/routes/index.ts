import { Router } from "express";

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import commentRoutes from "./commentRoutes";
import feedbackRoutes from "./feedbackRoutes";
import { strictLimiter } from "../middleware/rateLimiter.middleware";


const apiRouter = Router();

apiRouter.use("/auth", strictLimiter, authRoutes);
apiRouter.use("/user", strictLimiter, userRoutes);
apiRouter.use("/comment", strictLimiter, commentRoutes);
apiRouter.use("/feedback", strictLimiter, feedbackRoutes);


export default apiRouter;