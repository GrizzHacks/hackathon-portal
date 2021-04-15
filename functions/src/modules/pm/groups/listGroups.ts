import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listGroups: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeGroups")
    .get()
    .then((documents) => {
      const prizeGroups: PMGroup[] = [];
      for (const doc of documents.docs) {
        prizeGroups.push(doc.data() as PMGroup);
      }
      res
        .status(200)
        .send(JSON.stringify( { prizeGroups } as PMGroupList));
      next();
    })

    .catch(errorHandler);
};

export default listGroups;
