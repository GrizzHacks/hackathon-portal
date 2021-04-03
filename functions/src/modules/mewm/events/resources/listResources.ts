import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";

const listResources: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .collection("resources")
    .orderBy("resourceName", "asc")
    .get()
    .then((documents) => {
      const resources: MEWMEventResource[] = [];
      for (const doc of documents.docs) {
        resources.push(doc.data() as MEWMEventResource);
      }
      res.status(200).send(JSON.stringify({ resources } as MEWMResourceList));
      next();
    })

    .catch(errorHandler);
};

export default listResources;
