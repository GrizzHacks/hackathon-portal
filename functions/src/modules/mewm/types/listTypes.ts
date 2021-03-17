import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const listTypes: ExpressFunction = (req, res, next) => {
    execute(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("eventTypes")
    .orderBy("eventTypeName", "asc")
    .get()
    .then((documents) => {
      const eventTypes: MEWMEventType[] = [];
      for (const doc of documents.docs) {
        eventTypes.push(doc.data() as MEWMEventType);
      }
      res
        .status(200)
        .send(JSON.stringify({ eventTypes } as MEWMEventTypeList));
      next();
    })

    .catch(errorHandler);
};

export default listTypes;