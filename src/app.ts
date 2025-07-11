import cors from "cors";
import dotenv from "dotenv";
import express from "express";


dotenv.config();

import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { globalLimiter } from "./middleware/rateLimiter.middleware";
import { unknownRoutesHandler } from "./middleware/unknownRoutesHandler.middleware";
import { trimRequest } from "./middleware/trimRequest.middleware";


const createApp = () => {
  const app = express();

  app.disable('x-powered-by');

  app.set('trust proxy', 1);

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.status(200).json({message: "API is healthy!"});
  });

  app.use(trimRequest);

  app.use("/api", globalLimiter, apiRouter);

  app.use(unknownRoutesHandler);

  app.use(errorHandler);

  return app;
};


export { createApp };