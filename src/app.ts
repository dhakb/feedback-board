import cors from "cors";
import dotenv from "dotenv";
import express from "express";


dotenv.config();

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import { errorHandler } from "./middleware/errorHandler";


const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.status(200).json({message: "API is healthy!"});
  });

  app.use("/auth", authRoutes);
  app.use("/feedback", feedbackRoutes);
  app.use("/comment", commentRoutes);
  app.use("/user", userRoutes);

  app.use(errorHandler);

  return app;
};


export { createApp };