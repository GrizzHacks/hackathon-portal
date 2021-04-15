import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const updateApplication: ExpressFunction = (req, res, next) => {
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
      university: { rules: ["string", "emptystring"] },
      bestSkill: { rules: ["string", "emptystring"] },
      email: { rules: ["string", "emptystring"] },
      numberOfPreviousHackathons: { rules: ["string", "emptystring"] },
      otherQuestions: {
        rules: [{ type: "dictionary", rules: ["string", "number"] }],
      },
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

const validateHacker: ExpressFunction = (req, res, next) => {
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
  requestBodyTypeValidator(
    req,
    res,
    next
  )(validationRules, executeIfHackerMatches);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMApplicationUpdateRequest;

  firebaseApp
    .firestore()
    .collection("profiles")
    .doc(req.params.profileId)
    .collection("applications")
    .doc(req.params.applicationId)
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
    .collection("applications")
    .doc(req.params.applicationId)
    .get()
    .then((doc) => {
      if (user === (doc.data() as URMApplication | undefined)?.applicationId) {
        execute(req, res, next);
      } else {
        errorHandler(
          `A hacker ${user} tried updating application ${req.params.applicationId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
    })
    .catch(errorHandler);
};

export default updateApplication;
