import { logger } from ".";
import type { ExpressFunction } from "../@types";

export const logErrorSendMessage: ExpressFunction<
  (
    error: any,
    statusCode?: number,
    message?: any,
    severity?: "LOG" | "DEBUG" | "INFO" | "WARN" | "ERROR"
  ) => void
> = (req, res, next) => (
  error,
  statusCode = 500,
  message = "Sorry, something went wrong. Please try again later.",
  severity = "ERROR"
) => {
  switch (severity) {
    case "LOG":
      logger.log(error);
      break;
    case "DEBUG":
      logger.debug(error);
      break;
    case "INFO":
      logger.info(error);
      break;
    case "WARN":
      logger.warn(error);
      break;
    case "ERROR":
      logger.error(error);
      break;
  }
  res.status(statusCode).send(message);
  next();
};
