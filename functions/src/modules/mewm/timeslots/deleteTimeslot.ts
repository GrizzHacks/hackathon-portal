import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";


const deleteTimeslot: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: execute }, // TO-DO: Need to filter only sponsor event managers allowed permission here
  })(req, res, next);
};


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("timeslot")
    .doc(req.params.eventId)
    .delete()
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default deleteTimeslot;