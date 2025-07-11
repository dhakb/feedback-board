import { NextFunction, Request, Response } from "express";


export const unknownRoutesHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({message: `Not Found`});
  return;
};