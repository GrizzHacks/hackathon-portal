import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateRules: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      ruleName: { rules: ["string"] },
      ruleOrder: { rules: ["number"] },
      role: {
        rules: [
          {
            type: "enum",
            rules: ["organizer", "sponsor", "mentor", "volunteer", "hacker"],
          },
        ],
      },
      applicationQuestionId: { rules: ["string"] },
      acceptedValues: { rules: ["string"] },
      matchesRemaining: { rules: ["number"] },
      result: { rules: [{ type: "enum", rules: ["accepted", "rejected"] }] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as URMRulesUpdateRequest;

  firebaseApp
    .firestore()
    .collection("rules")
    .doc(req.params.rulesId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default updateRules;
