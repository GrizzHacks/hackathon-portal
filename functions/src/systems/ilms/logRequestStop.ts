import type { ExpressFunction } from "../../@types";
import { logger } from "../../helpers";

const logRequestStopFactory: (endpoint: string) => ExpressFunction = (
  endpoint
) => (req, res, next) => {
  logger.info(
    `Request made to ${endpoint}${req.url} completed in ${
      Date.now() - (res.locals.startTime as Date).valueOf()
    } milliseconds with a final status code of ${res.statusCode}`
  );
  next();
};
export default logRequestStopFactory;
