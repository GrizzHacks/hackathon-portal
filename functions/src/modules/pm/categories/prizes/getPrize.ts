import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const getPrize: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfPrizeMatches },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("prizeCategory")
    .doc(req.params.companyId)
    .get()
    .then((document) => {
      const data = document.data() as STPMCompany | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`prizeCatoregory/${req.params.prizeId} has no data.`);
      }
    })
    .catch(errorHandler);
};

const executeIfPrizeMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const prizeCategories = (res.locals.permissions as UserPermission).company;
  if (prizeCategories === req.params.prizeId) {
    execute(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${prizeCategories} tried viewing benefits for ${req.params.prizeId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default getPrize;
