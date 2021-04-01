import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const createResource: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: { accepted: validate },
      })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        resourceId: { rules: ["string"], required: true },
        resourceName: { rules: ["string"], required: true },
        resourceDescription: { rules: ["string"], required: true },
        resourceUrl: { rules:  ["string"], required: true },
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };

  const execute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
  
    const body = res.locals.parsedBody as MEWMEventResources;
    firebaseApp
      .firestore()
      .collection("events")
      .doc(req.params.eventId)
      .collection("resources")
      .doc(body.resourceId)
      .set(body)
      .then(() => {
        res.status(201).send();
        next();
      })
      .catch(errorHandler);
  };

export default createResource;

