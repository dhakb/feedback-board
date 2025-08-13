import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";



export function authenticate(req: Request, res: Response, next: NextFunction) {
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
    req.user = jwt.verify(token, config.jwt.secret) as Express.UserPayload;
    next();
  } catch (err) {
    res.status(401).json({error: "Unauthorized", message: "Invalid token"});
  }
}
