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
      .collection("mewm/events/resources") //TO-DO pull the eventId as well to go to the correct resource folder as well
      .doc(req.params.resourceId)
      .delete()
      .then(() => {
        res.status(200).send();
        next();
      })
      .catch(errorHandler);
  };

export default deleteResource;
