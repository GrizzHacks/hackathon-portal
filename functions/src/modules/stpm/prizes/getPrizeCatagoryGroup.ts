import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory,  requestBodyTypeValidator} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getSuperCatagory: ExpressFunction = (req, res, next) => {
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
      .get()
      .then((document) => {
        const data = document.data() as STPMPrizeCatagoryGroup | undefined;
        if(data){
        res.status(200).send(data);
        next();
        } else {
            errorHandler('PrizeCatagoryGroup/${req.params.id} has no data');
        }
      })
      .catch(errorHandler);
  };
  export default getSuperCatagory;