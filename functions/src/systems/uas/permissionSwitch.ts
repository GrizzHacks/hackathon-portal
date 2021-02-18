import type { ExpressFunction } from "../../@types";
import { expressErrorHandlerFactory } from "../../helpers";

const permissionSwitchFactory: (
  moduleConfiguration: UASPermissionSwitchConfig<ExpressFunction>
) => ExpressFunction = (moduleConfiguration) => (req, res, next) => {
  const userPermission = res.locals.permissions as UserPermission;
  const runCallbackOrSendErrorMessge = runCallbackOrSendErrorMessgeFactory(
    req,
    res,
    next
  );
  switch (userPermission.role) {
    case "ORGANIZER":
      runCallbackOrSendErrorMessge(
        extractCallback(userPermission.accepted, moduleConfiguration.organizer)
      );
      break;
    case "SPONSOR":
      runCallbackOrSendErrorMessge(
        extractCallback(userPermission.accepted, moduleConfiguration.sponsor)
      );
      break;
    case "MENTOR":
      runCallbackOrSendErrorMessge(
        extractCallback(userPermission.accepted, moduleConfiguration.mentor)
      );
      break;
    case "VOLUNTEER":
      runCallbackOrSendErrorMessge(
        extractCallback(userPermission.accepted, moduleConfiguration.volunteer)
      );
      break;
    case "HACKER":
      runCallbackOrSendErrorMessge(
        extractCallback(userPermission.accepted, moduleConfiguration.hacker)
      );
      break;
    case "PUBLIC":
      runCallbackOrSendErrorMessge(moduleConfiguration.public, {
        status: 401,
        message:
          "Sorry, you are not authorized to perform this operation. Please try logging in then trying again.",
      });
      break;
    default:
      expressErrorHandlerFactory(
        req,
        res,
        next
      )(
        `UAS failed to determine user role! The current user's role: ${userPermission.role}`
      );
  }
};

const isCallbackConfig = (
  config?: UASPermissionSwitchCallbackConfig<ExpressFunction> | ExpressFunction
) => {
  return (
    (config as UASPermissionSwitchCallbackConfig<ExpressFunction>).accepted !==
      undefined ||
    (config as UASPermissionSwitchCallbackConfig<ExpressFunction>).pending !==
      undefined ||
    (config as UASPermissionSwitchCallbackConfig<ExpressFunction>).rejected !==
      undefined
  );
};

const extractCallback = (
  userAccpeted?: boolean,
  callbackConfig?:
    | ExpressFunction
    | UASPermissionSwitchCallbackConfig<ExpressFunction>
) => {
  if (callbackConfig && isCallbackConfig(callbackConfig)) {
    return userAccpeted
      ? (callbackConfig as UASPermissionSwitchCallbackConfig<ExpressFunction>)
          .accepted
      : userAccpeted === undefined
      ? (callbackConfig as UASPermissionSwitchCallbackConfig<ExpressFunction>)
          .pending
      : (callbackConfig as UASPermissionSwitchCallbackConfig<ExpressFunction>)
          .rejected;
  } else if (callbackConfig) {
    return callbackConfig as ExpressFunction;
  }
  return undefined;
};

const runCallbackOrSendErrorMessgeFactory: ExpressFunction<
  (
    callback?: ExpressFunction,
    errorMessage?: {
      status: number;
      message: string;
    }
  ) => void
> = (req, res, next) => (callback, errorMessage) => {
  if (callback) {
    callback(req, res, next);
  } else {
    expressErrorHandlerFactory(req, res, next)(
      "The requested did not have access to perform this operation!",
      errorMessage ? errorMessage.status : 403,
      errorMessage
        ? errorMessage.message
        : "Sorry, you do not have access to perform that operation.",
      "WARN"
    );
  }
};

export default permissionSwitchFactory;
