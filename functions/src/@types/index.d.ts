import type { NextFunction, Request, Response } from "express";

export type ExpressFunction<T = void> = (
  req: Request,
  res: Response,
  next: NextFunction
) => T;
