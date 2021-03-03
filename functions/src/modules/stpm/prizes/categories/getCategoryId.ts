import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const getcategoryid: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("prizeCategoriesId")
    .doc(req.params.categoryId)
    .get()
    .then((document) => {
      console.log(req.params.prizeCategoriesId);
      console.log(document.data());
      res.status(200).send(document.data());
      next();
    })
    .catch(errorHandler);
};

export default getcategoryid;
