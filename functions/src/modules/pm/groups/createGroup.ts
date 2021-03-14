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
        prizeCategoryId: { rules: ["string"], required: true },
        prizeCatagoryName: { rules: ["string"], required: true },
        prizeCategoryDescription: { rules: ["string"], required: true },
        //prizeCategoryOrder: { [key: string]: string }; TODO: Support Dictionary Advanced Types
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };

  const execute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
  
    const body = res.locals.parsedBody as STPMPrizeCatGroupCreateRequest;

  
    firebaseApp
      .firestore()
      .collection("PrizeCatagoryGroup")
      .doc(body.prizeCategoryId)
      .set(body)
      .then(() => {
        res.status(201).send();
        next();
      })
      .catch(errorHandler);
  };

export default createPrizeGroup;
