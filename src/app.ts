import cors from "cors";
import express from "express";

import { config } from "./config";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { globalLimiter } from "./middleware/rateLimiter.middleware";
import { unknownRoutesHandler } from "./middleware/unknownRoutesHandler.middleware";
import { trimRequest } from "./middleware/trimRequest.middleware";
import { setupSwagger } from "./swagger";

const createApp = () => {
  const app = express();

  app.disable('x-powered-by');

  app.set('trust proxy', 1);

  app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  }));
  
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.status(200).json({message: "API is healthy!"});
  });

  app.use(trimRequest);

  if (config.swagger.enabled) {
    setupSwagger(app);
  }

  app.use("/api", globalLimiter, apiRouter);

  app.use(unknownRoutesHandler);

  app.use(errorHandler);

  return app;
};

export { createApp };