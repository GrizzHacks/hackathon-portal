import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";


const getTimeslot: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute }
  })(req, res, next);
};



const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("timeslots")
    .doc(req.params.timeslotId)
    .get()
    .then((document) => {
      const data = document.data() as MEWMTimeslot | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`timeslot/${req.params.timeslotId} have no data.`);
      }
    })
    .catch(errorHandler);
};


export default getTimeslot;