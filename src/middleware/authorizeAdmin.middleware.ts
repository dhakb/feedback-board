import type { Request, Response, NextFunction } from "express";


export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
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
