import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
const createProfiles: ExpressFunction = (req, res, next) => {
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
      firstName: { rules: ["string"] },
      lastName: { rules: ["string"] },
      university: { rules: ["string", "emptystring"] },
      bestSkill: { rules: ["string", "emptystring"] },
      email: { rules: ["string", "emptystring"] },
      numberOfPreviousHackathons: { rules: ["string", "emptystring"] },
      studentStatus: {
        rules: [
          {
            type: "enum",
            rules: ["freshman", "sophomore", "junior", "senior"],
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMProfileCreateRequest;

  firebaseApp
    .firestore()
    .collection("profiles")
    .doc(body.profileId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createProfiles;
