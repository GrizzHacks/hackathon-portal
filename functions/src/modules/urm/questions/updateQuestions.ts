import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
const updateQuestion: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      applicationQuestionLabel: { rules: ["string"] },
      applicationQuestionUsage: {
        rules: [
          {
            type: "object",
            rules: {
              organizer: { rules: ["boolean"] },
              sponsor: { rules: ["boolean"] },
              mentor: { rules: ["boolean"] },
              volenteer: { rules: ["boolean"] },
              hacker: { rules: ["boolean"] },
            },
          },
        ],
      },
      values: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("questions")
    .doc(req.params.questionsId)
    .update(res.locals.parsedBody as URMQuestionsCreateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default updateQuestion;
