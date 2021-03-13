import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getCategory: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfCategoryMatches },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.prizeCategoryId)
    .get()
    .then((document) => {
      const data = document.data() as PMCategory | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`prizeCategories/${req.params.prizeCategoryId} has no data.`);
      }
    })
    .catch(errorHandler);
};

const executeIfCategoryMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const prizeCategory = (res.locals.permissions as UserPermission).company;
  if (prizeCategory === req.params.prizeCategoryId) {
    execute(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${prizeCategory} tried viewing benefits for ${req.params.prizeCategoryId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default getCategory;
