import rateLimit from "express-rate-limit";


export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minutes
  limit: 30,             // Limit each IP to X requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  message: {message: "Too many requests, please try again later."}
});

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minutes
  limit: 500,            // Limit each IP to X requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  message: {message: "Too many requests, please try again later."}
});