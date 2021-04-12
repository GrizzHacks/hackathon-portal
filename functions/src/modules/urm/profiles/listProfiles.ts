import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listProfiles: ExpressFunction = (req, res, next) => {
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
    .collection("profiles")
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
  const profiles: URMProfile[] = [];
  for (const doc of docs) {
    profiles.push(doc.data() as URMProfile);
  }
  res.status(200).send(JSON.stringify({ profiles } as URMProfileList));
  next();
};

export default listProfiles;
