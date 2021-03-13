import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listEvents: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    public: execute
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("events")
    .orderBy("eventName", "asc")
    .get()
    .then((documents) => {
      const miniEvents: MEWMEvent[] = [];
      for (const doc of documents.docs) {
        miniEvents.push(doc.data() as MEWMEvent);
      }
      res
        .status(200)
        .send(JSON.stringify({ miniEvents } as MEWMEventList));
      next();
    })

    .catch(errorHandler);
};

export default listEvents;