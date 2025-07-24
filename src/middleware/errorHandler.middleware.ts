import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";


export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({status: "fail", error: {message: err.message}});
    return;
  }

  res.status(500).json({status: "fail", error: {message: "Internal Server Error"}});
  return;
}

