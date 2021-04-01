import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createPrizeGroup: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: { accepted: validate },
      })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        prizeGroupId: { rules: ["string"], required: true },
        prizeGroupName: { rules: ["string"], required: true },
        prizeGroupDescription: { rules: ["string"], required: true },
        prizeGroupOrder: {
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
  
    const body = res.locals.parsedBody as PMGroupCreateRequest;

  
    firebaseApp
      .firestore()
      .collection("prizeGroups")
      .doc(body.prizeGroupId)
      .set(body)
      .then(() => {
        res.status(201).send();
        next();
      })
      .catch(errorHandler);
  };

export default createPrizeGroup;
