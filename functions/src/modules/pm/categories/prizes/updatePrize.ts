import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from '../../../../systems/uas';



const updatePrize: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: execute },
    // sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
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