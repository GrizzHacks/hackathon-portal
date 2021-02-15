import type { NextFunction, Request, Response } from "express";
import * as functions from "firebase-functions";

export default (endpoint: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  functions.logger.info(
    `Request made to ${endpoint}${req.url} completed in ${
      Date.now() - (res.locals.startTime as Date).valueOf()
    } milliseconds with a final status code of ${res.statusCode}`
  );
  next();
};
