import type { ExpressFunction } from "../../../@types";
import { uasPermissionSwitch } from "../../../systems/uas";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory, requestBodyTypeValidator, } from "../../../helpers";

const postPrizeCatagoryGroup: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: validate },
    // sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const validate: ExpressFunction = (req,res,next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeCatagoryName: {rules: ["string"]},
      prizeCategoryDescription: {rules: ["string"]},
      //prizeCategoryOrder: {rules: ["Array<string>"]}, // TODO support advance types
    }
  }
  requestBodyTypeValidator(req,res,next)((validationRules), execute);
}

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeCategoryGroup")
    .doc(req.params.prizeId)
    .update(res.locals.body as STPMPrizeCatGroupUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

  export default postPrizeCatagoryGroup;



