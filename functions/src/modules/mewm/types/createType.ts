import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createType: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventTypeId: { rules: ["string"], required: true },
      eventTypeName: { rules: ["string"], required: true },
      eventTypeDescription: { rules: ["string", "emptystring"] },
 //   permissions: {rules: }
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as MEWMEventTypeCreateRequest;

  if (body.eventTypeDescription === undefined) {
    body.eventTypeDescription = "";
  }

  firebaseApp
    .firestore()
    .collection("eventTypes")
    .doc(body.eventTypeId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createType;