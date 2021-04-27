import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createRules: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      ruleId: { rules: ["string"], required: true },
      ruleName: { rules: ["string"], required: true },
      ruleOrder: { rules: ["number"] },
      role: {
        rules: [
          {
            type: "enum",
            rules: ["organizer", "sponsor", "mentor", "volunteer", "hacker"],
          },
        ],
        required: true,
      },
      applicationQuestionId: { rules: ["string"], required: true },
      acceptedValues: { rules: ["string"], required: true },
      matchesRemaining: { rules: ["number"] },
      result: { rules: [{ type: "enum", rules: ["accepted", "rejected"] }] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMRulesCreateRequest;

  if (body.ruleOrder === undefined) {
    body.ruleOrder = Date.now();
  }
  if (body.matchesRemaining === undefined) {
    body.matchesRemaining = 1;
  }
  if (body.result === undefined) {
    body.result = "accepted";
  }

  firebaseApp
    .firestore()
    .collection("rules")
    .doc(body.ruleId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createRules;
