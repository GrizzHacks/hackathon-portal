import { logErrorSendMessage } from "./errorHandlers";
import functionsLogger from "./functionsLogger";

export const logger = functionsLogger;
export const expressErrorHandlerFactory = logErrorSendMessage;
