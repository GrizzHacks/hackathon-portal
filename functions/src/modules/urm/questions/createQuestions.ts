import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createQuestions: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      questionsId: { rules: ["string"], required: true },
      applicationQuestionLabel: { rules: ["string"], required: true },
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
        required: true,
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMQuestionsCreateRequest;

  body.applicationQuestionUsage = body.applicationQuestionUsage
    ? body.applicationQuestionUsage
    : {};

  firebaseApp
    .firestore()
    .collection("questions")
    .doc(body.questionsId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createQuestions;
