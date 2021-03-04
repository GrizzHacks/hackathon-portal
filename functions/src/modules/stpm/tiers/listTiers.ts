import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listTiers: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorTiers")
    .orderBy("sponsorTierOrder", "asc")
    .get()
    .then((documents) => {
      const sponsorTiers: STPMTier[] = [];
      for (const doc of documents.docs) {
        sponsorTiers.push(doc.data() as STPMTier);
      }
      res.status(200).send({ sponsorTiers } as STPMTierList);
      next();
    })

    .catch(errorHandler);
};

export default listTiers;
