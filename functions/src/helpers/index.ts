import { logErrorSendMessage } from "./errorHandlers";
import functionsLogger from "./functionsLogger";
// import { parseJsonBodyAndValidateTypeFactory } from "./typeValidator";

export const logger = functionsLogger;
export const expressErrorHandlerFactory = logErrorSendMessage;
// export const requestBodyTypeValidator = parseJsonBodyAndValidateTypeFactory;
