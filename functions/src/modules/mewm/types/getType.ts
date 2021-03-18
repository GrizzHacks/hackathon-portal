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
    .doc(req.params.typeId)
    .get()
    .then((document) => {
      const data = document.data() as MEWMEventType | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`eventTypes/${req.params.typeId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getEventType;
