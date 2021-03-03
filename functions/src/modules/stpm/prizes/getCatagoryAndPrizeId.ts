import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getPrizeId: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
      organizer: { accepted: execute },
    })(req, res, next);
  };

const execute: ExpressFunction = (req, res, next) => {
      const errorHandler = expressErrorHandlerFactory(req, res, next);
      firebaseApp
      .firestore()
      .collection("Prizes")
      .doc(req.params.prizeId)
      .get()
      .then((document) => {
          console.log(req.params.prizeId);
          console.log(document.data());
          res.status(200).send(document.data());
          next();
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
