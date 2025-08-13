import { ZodSchema } from "zod";
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/ApiError";


type SchemaBundle = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export const validateRequest = (schemas: SchemaBundle) => (req: Request, _res: Response, next: NextFunction) => {
  if (schemas.body) {
    const result = schemas.body.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestError("Invalid input. Please verify your input format");
    }
    req.body = result.data;
  }

  if (schemas.params) {
    const result = schemas.params.safeParse(req.params);
    if (!result.success) {
      throw new BadRequestError("Invalid route params. Please verify your input format");
    }
    Object.assign(req.params as any, result.data);
  }

  if (schemas.query) {
    const result = schemas.query.safeParse(req.query);
    if (!result.success) {
      throw new BadRequestError("Invalid query string. Please verify your input format");
    }
    Object.assign(req.query as any, result.data);
  }

  next();
};