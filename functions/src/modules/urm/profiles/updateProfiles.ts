import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateProfile: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
    hacker: { accepted: validateHacker },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      firstName: { rules: ["string"] },
      lastName: { rules: ["string"] },
      phoneNumber: { rules: ["string", "emptystring"] },
      photoUrl: { rules: ["string", "emptystring"] },
      email: { rules: ["string"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateHacker: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      firstName: { rules: ["string"] },
      lastName: { rules: ["string"] },
      phoneNumber: { rules: ["string", "emptystring"] },
      photoUrl: { rules: ["string", "emptystring"] },
      email: { rules: ["string"] },
      otherQuestions: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(
    req,
    res,
    next
  )(validationRules, executeIfHackerMatches);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMProfileUpdateRequest;

  firebaseApp
    .firestore()
    .collection("profiles")
    .doc(req.params.profileId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfHackerMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const user = (res.locals.permissions as UserPermission).userId;

  firebaseApp
    .firestore()
    .collection("profiles")
    .doc(req.params.profileId)
    .get()
    .then((doc) => {
      if (user === (doc.data() as URMProfile | undefined)?.profileId) {
        execute(req, res, next);
      } else {
        errorHandler(
          `A hacker ${user} tried updating profile ${req.params.profileId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
    })
    .catch(errorHandler);
};

export default updateProfile;
