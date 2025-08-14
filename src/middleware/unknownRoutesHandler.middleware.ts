import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/ApiError";


export const unknownRoutesHandler = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {
  throw new NotFoundError("Not Found");
};