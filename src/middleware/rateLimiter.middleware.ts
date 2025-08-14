import rateLimit from "express-rate-limit";
import { config } from "../config";
import { ApiError } from "../errors/ApiError";

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  handler: (_req, _res, next, _options) => {
    next(new ApiError("Too many requests from this IP, please try again later.", 429));
  },
  standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,       // Disable the `X-RateLimit-*` headers
});