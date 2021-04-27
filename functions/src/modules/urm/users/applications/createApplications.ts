import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";
const createapplications: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: {
      accepted: validate,
      pending: validate,
      rejected: validate,
    },
    sponsor: {
      accepted: validate,
      pending: validate,
      rejected: validate,
    },
    mentor: validate,
    volunteer: validate,
    hacker: validate,
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      applicationId: { rules: ["string"], required: true },
      firstName: { rules: ["string"], required: true },
      lastName: { rules: ["string"], required: true },
      phoneNumber: { rules: ["string", "emptystring"] },
      photoUrl: { rules: ["string", "emptystring"] },
      email: { rules: ["string"], required: true },
      otherBenefits: {
        rules: [{ type: "dictionary", rules: ["string", "number"] }],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMApplicationCreateRequest;

  firebaseApp
    .firestore()
    .collection("users")
    .doc(req.params.userId)
    .collection("applications")
    .doc(body.applicationId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createapplications;
