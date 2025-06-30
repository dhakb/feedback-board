import { Response, NextFunction } from "express";
import type { AuthRequest } from "./authenticate.middleware";


export function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({error: "Unauthorized"});
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({error: "Admin access required"});
    return;
  }

  next();
}
