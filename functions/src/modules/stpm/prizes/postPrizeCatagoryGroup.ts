import type { ExpressFunction } from "../../../@types";
import { uasPermissionSwitch } from "../../../systems/uas";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const postPrizeCatagoryGroup: ExpressFunction = (req, res, next) => {
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
    .collection("prizeCategoryGroup")
    .doc(req.params.prizeId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

  export default postPrizeCatagoryGroup;



