import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const deleteResource: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: {accepted: validateExecute},
        sponsor: {accepted: validateExecute},
    })
};

const validateExecute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
  
    firebaseApp
      .firestore()
      .collection("events")
      .doc(req.params.eventId)
      .collection("resources")
      .doc(req.params.resourceId)
      .delete()
      .then(() => {
        res.status(200).send();
        next();
      })
      .catch(errorHandler);
  };

export default deleteResource;
