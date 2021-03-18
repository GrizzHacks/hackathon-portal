import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listTimeSlot: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: {
      accepted: execute,
      pending: executeIfApproved,
      rejected: executeIfApproved,
    },
 
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("timeslot")
    .orderBy("startTime", "asc")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};

const executeIfApproved: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("timeslot")
    .orderBy("startTime", "asc")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};

const send: (
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
) => ExpressFunction = (docs) => (req, res, next) => {
  const timeslot: MEWMTimeslotList[] = [];
  for (const doc of docs) {
    timeslot.push(doc.data() as MEWMTimeslotList );
  }
  //res.status(200).send(JSON.stringify({ timeslot } as MEWMTimeslotList));
  next();
};


export default listTimeSlot;