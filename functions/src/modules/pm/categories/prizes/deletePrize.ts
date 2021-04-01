import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory,  requestBodyTypeValidator} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const deleteCatagoryAndPrizeId: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: {accepted: validate},
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
    .collection("PrizeCatagoryGroup")
    .doc(req.params.id)
    .delete()
    .then(() => {
        res.status(200).send();
    })
    .catch(errorHandler)
  };
export default deleteCatagoryAndPrizeId;
