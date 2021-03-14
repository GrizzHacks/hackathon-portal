import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";

const getRecources: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
    firebaseApp
      .firestore()
      .collection("mewm/events/resources")
      .doc(req.params.resourceId)
      .get()
      .then((document) => {
        const data = document.data() as MEWMEventResources | undefined;
        if (data) {
          res.status(200).send(JSON.stringify(data));
          next();
        } else {
          errorHandler(`Resources in /${req.params.resourceId} has no data.`);
        }
      })
      .catch(errorHandler);
};

export default getRecources;
