import cors from "cors";
import dotenv from "dotenv";
import express from "express";


dotenv.config();

import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler";


const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.status(200).json({message: "API is healthy!"});
  });

  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
};


export { createApp };