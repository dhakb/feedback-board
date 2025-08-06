import { Router } from "express";

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import commentRoutes from "./commentRoutes";
import feedbackRoutes from "./feedbackRoutes";


const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", userRoutes);
apiRouter.use("/comment", commentRoutes);
apiRouter.use("/feedback", feedbackRoutes);


export default apiRouter;