import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const getPrizeId: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
      organizer: { accepted: execute },
    })(req, res, next);
  };



const execute: ExpressFunction = (req, res, next) => {
      const errorHandler = expressErrorHandlerFactory(req, res, next);
      firebaseApp
      .firestore()
    .collection("prizeCategories)
    .doc(req.params.categoryId)
    .collection("prizes")
      .doc(req.params.prizeId)
      .get()
      .then((document) => {
        const data = document.data() as PMPrize | undefined;
        if(data){
        res.status(200).send(data);
        next();
        } else{
          errorHandler('Prizes ${req.params.prizeId} has no data');

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
