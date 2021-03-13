import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listEvents: ExpressFunction = (req, res, next) => {
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
    .orderBy("eventName", "asc")
    .get()
    .then((documents) => {
      const miniEvents: METMMiniEvent[] = [];
      for (const doc of documents.docs) {
        miniEvents.push(doc.data() as METMMiniEvent);
      }
      res
        .status(200)
        .send(JSON.stringify({ miniEvents } as METMMiniEventList));
      next();
    })

    .catch(errorHandler);
};

export default listEvents;