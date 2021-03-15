import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const listPrize: ExpressFunction = (req, res, next) => {
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
    .collection("prize")
    .orderBy("prizeName", "asc")
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
    .collection("prize")
    .orderBy("prizeName", "asc")
    .where("approvalStatus", "==", "approved")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};

const send: (
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
) => ExpressFunction = (docs) => (req, res, next) => {
  const prizeCategories: PMCategory[] = [];
  for (const doc of docs) {
    prizeCategories.push(doc.data() as PMCategory);
  }
  res.status(200).send(JSON.stringify({ prizeCategories } as PMCategoryList));
  next();
};

export default listPrize;
