import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getEvent: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("mewm/events")
    .doc(req.params.eventId)
    .get()
    .then((document) => {
      const data = document.data() as MEWMEvent | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`Mini-Event /${req.params.eventId} has no data.`);
      }
    })
    .catch(errorHandler);
};


export default getEvent;
