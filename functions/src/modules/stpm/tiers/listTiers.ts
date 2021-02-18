import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listTiers: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) =>{
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("sponsorTiers")
    .orderBy("sponsorTierOrder", "asc")
    .get()
    .then((documents) => {
      console.log(documents.docs);
      res.status(200).send({sponsorTiers: documents.docs});
      next();
    })


    .catch(errorHandler)
};

export default listTiers;
