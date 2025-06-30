import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";


export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({error: err.message});
    return;
  }

  res.status(500).json({error: "Internal Server Error"});
  return;
}

