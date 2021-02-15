import type { NextFunction, Request, Response } from "express";
import * as functions from "firebase-functions";

export default (endpoint: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Store the start time of the request
  res.locals.startTime = new Date();
  functions.logger.info(`Request made to ${endpoint}${req.url}`);
  next();
};
