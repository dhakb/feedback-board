import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";


export interface AuthRequest extends Request {
  user?: { userId: string, role: string };
}


export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({error: "Unauthorized", message: "Authorization header missing"});
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({error: "Unauthorized", message: "Invalid token"});
    return;
  }

  try {
    req.user = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
    next();
  } catch (err) {
    res.status(401).json({error: "Unauthorized", message: "Invalid token"});
  }
}
