import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { UnauthorizedError } from "../errors/ApiError";



export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Invalid token");
  }

  try {
    req.user = jwt.verify(token, config.jwt.secret) as Express.UserPayload;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
}
