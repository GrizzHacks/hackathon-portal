import type { NextFunction, Request, Response } from "express";

const deleteTier = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send();
  next();
};

export default deleteTier;
