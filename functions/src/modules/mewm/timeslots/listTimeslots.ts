import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listTimeSlot: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: {
      accepted: execute,
    },
 
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("timeslots")
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
  const timeslots: MEWMTimeslot[] = [];
  for (const doc of docs) {
    timeslots.push(doc.data() as MEWMTimeslot );
  }
  res.status(200).send(JSON.stringify({ timeslots } as MEWMTimeslotList));
  next();
};


export default listTimeSlot;
