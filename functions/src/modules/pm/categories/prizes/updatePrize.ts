import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
    expressErrorHandlerFactory,
    requestBodyTypeValidator,
  } from "../../../../helpers";
import { uasPermissionSwitch } from '../../../../systems/uas';



const updatePrize: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: validate},
    // sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};
const validate: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        prizeName: { rules: ["string"], required: true },
        PrizeUrl: { rules: ["string"]},
        prizeCategory: { rules: ["string"]},
        prizeListingName: { rules: ["string"], required: true },
        //overriddenBenefits: { [key: string]: string }; TODO: Support Dictionary Advanced Types
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };

const execute: ExpressFunction = (req, res, next) => {

  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = JSON.parse(req.body)

  firebaseApp
    .firestore()
    .collection("UpdatePrize")
    .doc(req.params.prizeId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};


// const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
//   const errorHandler = expressErrorHandlerFactory(req, res, next);
//   const prizeCategories = (res.locals.permissions as UserPermission).company;
//   if (prizeCategories === req.params.prizeId) {
//     execute(req, res, next);
//   } else {
//     errorHandler(
//       `A sponsor from ${prizeCategories} tried viewing benefits for ${req.params.prizeId}.`,
//       403,
//       "Sorry, you do not have access to perform that operation."
//     );
//   }
// };

export default updatePrize;