import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    public: execute
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .get()
    .then((document) => {
      const data = document.data() as MEWMEvent | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`events/${req.params.eventId} have no data.`);
      }
    })
    .catch(errorHandler);
};

export default getEvent;