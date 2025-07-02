import { ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/ApiError";


export const validateRequestInput = (schema: ZodSchema<any>) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError("Invalid input. Please verify your input format");
  }

  req.body = result.data;
  next();
};