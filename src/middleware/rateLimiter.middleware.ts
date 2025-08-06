import rateLimit from "express-rate-limit";
import { config } from "../config";

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,       // Disable the `X-RateLimit-*` headers
});