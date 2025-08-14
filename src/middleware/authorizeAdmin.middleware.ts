import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/ApiError";


export function authorizeAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (req.user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }

  next();
}
