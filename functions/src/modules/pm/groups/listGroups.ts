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
    .collection("pm/groups")
    .orderBy("GroupOrder", "asc")
    .get()
    .then((documents) => {
      const prizeCategorys: PMGroup[] = [];
      for (const doc of documents.docs) {
        prizeCategorys.push(doc.data() as PMGroup);
      }
      res.status(200).send(JSON.stringify({ prizeCategorys } as PMGroupList));
      next();
    })

    .catch(errorHandler);
};

export default listGroups;
