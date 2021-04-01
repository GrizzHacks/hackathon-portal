import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
const updateQuestion: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: {accepted: validate}
    })(req,res,next);
};

const validate: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        applicationQuestionId: { rules: ["string"], required: true },
        applicationQuestionLabel: { rules: ["string"], required: true },
        applicationQuestionUsage: {
             rules: [
                 {
                     type: "enum", 
                     rules: [1,2,3,4,5],
                 },
                ],
                 required: true },
        values: {
            rules: [
            {
                type: "array",
                rules: ["string"],
            },
            ],
        required: true},
        
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };

  const execute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
  
    firebaseApp
      .firestore()
      .collection("questions")
      .doc(req.params.applicationQuestionId)
      .update(res.locals.parsedBody as URMQuestionsCreateRequest)
      .then(() => {
        res.status(200).send();
        next();
      })
      .catch(errorHandler);
  };

export default updateQuestion;
