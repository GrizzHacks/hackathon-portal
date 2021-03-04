import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getTier: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorTiers")
    .doc(req.params.tierId)
    .get()
    .then((document) => {
      const data = document.data() as STPMTier | undefined;
      if (data) {
        res.status(200).send(data);
        next();
      } else {
        errorHandler(`sponsorTiers/${req.params.tierId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getTier;
