import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: execute },
    mentor: { accepted: execute },
    volunteer: { accepted: execute },
    hacker: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("miniEvents")
    .doc(req.params.eventId)
    .get()
    .then((document) => {
      const data = document.data() as METMMiniEvent | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`miniEvents/${req.params.eventId} have no data.`);
      }
    })
    .catch(errorHandler);
};

export default getEvent;