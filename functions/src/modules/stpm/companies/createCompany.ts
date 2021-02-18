import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";




const createCompany: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("sponsorCompany")
    .doc(req.params.companyId)
    .set(req.body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};


export default createCompany;
