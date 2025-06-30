import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";


const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export interface AuthRequest extends Request {
  user?: { userId: string, role: string };
}


export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({error: "No token provided"});
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({error: "Token missing"});
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    next();
  } catch (err) {
    res.status(401).json({error: "Invalid token"});
  }
}
