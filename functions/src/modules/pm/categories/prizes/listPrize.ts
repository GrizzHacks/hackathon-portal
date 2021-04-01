import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const listPrizes: ExpressFunction = (req, res, next) => {
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
    .collection("prizeCategories)
    .doc(req.params.categoryId)
    .collection("prizes")
    .orderBy("prizeId", "asc")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};



// const executeIfApproved: ExpressFunction = (req, res, next) => {
//   const errorHandler = expressErrorHandlerFactory(req, res, next);

//   firebaseApp
//     .firestore()
//     .collection("Prize")
//     .orderBy("prizeName", "asc")
//     .where("approvalStatus", "==", "approved")
//     .get()
//     .then((documents) => {
//       send(documents.docs)(req, res, next);
//     })
//     .catch(errorHandler);
// };

const send: (
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
) => ExpressFunction = (docs) => (req, res, next) => {
  const prizes: PMPrize[] = [];
  for (const doc of docs) {
    prizes.push(doc.data() as PMPrize );
  }
  res.status(200).send(JSON.stringify({ prizes } as PMPrizeList));
  next();
};

export default listPrizes;
