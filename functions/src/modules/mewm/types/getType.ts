import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getEventType: ExpressFunction = (req, res, next) => {
    execute(req, res, next);
  };

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("eventTypes")
    .doc(req.params.eventTypeId)
    .get()
    .then((document) => {
      const data = document.data() as MEWMEventType | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`eventtypes/${req.params.eventTypeId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getEventType;