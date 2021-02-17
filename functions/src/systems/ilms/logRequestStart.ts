import { logger } from "../../helpers";
import type { ExpressFunction } from "../../@types";

const logRequestStartFactory: (endpoint: string) => ExpressFunction = (
  endpoint
) => (req, res, next) => {
  // Store the start time of the request
  res.locals.startTime = new Date();
  logger.info(`Request made to ${endpoint}${req.url}`);
  next();
};

export default logRequestStartFactory;
