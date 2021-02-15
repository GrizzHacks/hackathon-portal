import type { NextFunction, Request, Response } from "express";

const createTier = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send();
  next();
};

export default createTier;
