import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const getProfile: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: execute },
    hacker: { accepted: execute },
    mentor: { accepted: execute },
    volunteer: { accepted: execute },
  })(req, res, next);
};


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("application")
    .doc(req.params.applicationId)
    .get()
    .then((document) => {
      const data = document.data() as URMApplication| undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`application/${req.params.applicationId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getProfile;