import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const listApplication: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: {
      accepted: execute,
      pending: execute,
      rejected: execute,
    },
    sponsor: {
      accepted: execute,
      pending: execute,
      rejected: execute,
    },
    mentor: execute,
    volunteer: execute,
    hacker: execute,
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("users")
    .doc(req.params.userId)
    .collection("applications")
    .orderBy("lastName", "asc")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};

const send: (
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
) => ExpressFunction = (docs) => (req, res, next) => {
  const application: URMApplication[] = [];
  for (const doc of docs) {
    application.push(doc.data() as URMApplication);
  }
  res.status(200).send(JSON.stringify({ application } as URMApplicationList));
  next();
};

export default listApplication;
