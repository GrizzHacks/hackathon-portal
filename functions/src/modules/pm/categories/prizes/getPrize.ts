import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory,requestBodyTypeValidator } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const getPrizeId: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
      organizer: { accepted: validate },
    })(req, res, next);
  };

  const validate: ExpressFunction = (req,res,next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        prizeCategoryId: {rules: ["string"]},
        prizeCategoryName: {rules: ["string"]},
        prizeCategoryDescription:{rules: ["string"]},
        eligibility: {rules: ["string"]},
        //prize?:{rules: ["Prize"]}; //TODO create new datatype prizes
        companyId: {rules: ["string"]},
        approvalStatus: {rules: ["string"]},
      }
    }
    requestBodyTypeValidator(req,res,next)((validationRules), execute);
  }

const execute: ExpressFunction = (req, res, next) => {
      const errorHandler = expressErrorHandlerFactory(req, res, next);
      firebaseApp
      .firestore()
      .collection("Prizes")
      .doc(req.params.prizeId)
      .get()
      .then((document) => {
        const data = document.data() as STPMPrizeCatagories | undefined;
        if(data){
        res.status(200).send(data);
        next();
        } else{
          errorHandler('PrizeCatagories${req.params.id} has no data');

        }
          
      }).catch(errorHandler);
  };

 /*  const executeIfPrizeCatagoryMatches: ExpressFunction = (req, res, next) => {
      const errorHandler = expressErrorHandlerFactory(req, res, next);
      const prizeId = (res.locals.permissions as UserPermission).company;
      if(prizeId === req.params.prizeId){
          execute(req, res, next);
      } else {
        errorHandler(
          `A sponsor from ${} tried viewing a prize for ${req.params.companyId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
  };  wasnt sure how to implement this */

  export default getPrizeId;