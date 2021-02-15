import type { NextFunction, Request, Response } from "express";

const createCompany = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send();
  next();
};

export default createCompany;
