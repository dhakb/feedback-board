import { Request, Response, NextFunction } from "express";


function trim(obj: any) {
  if (typeof obj !== "object" || obj === null) return obj;

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string") {
      obj[key] = val.trim();
    } else if (typeof val === "object") {
      trim(val);
    }
  }
  return obj;
}

export const trimRequest = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) trim(req.body);
  if (req.query) trim(req.query);
  if (req.params) trim(req.params);
  next();
};
