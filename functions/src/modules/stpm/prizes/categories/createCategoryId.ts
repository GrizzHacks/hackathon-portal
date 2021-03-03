import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const createCategoryPrize: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: execute },
    
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);


  const body = JSON.parse(req.body)

  firebaseApp
    .firestore()
    .collection("prizeCategoriesPrize")
    .doc(body.CategoryId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createCategoryPrize;
