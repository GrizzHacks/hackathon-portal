import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listCategories: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: {
      accepted: execute,
      pending: executeIfApproved,
      rejected: executeIfApproved,
    },
    sponsor: {
      accepted: executeIfSponsorMatches,
      pending: executeIfApproved,
      rejected: executeIfApproved,
    },
    mentor: executeIfApproved,
    volunteer: executeIfApproved,
    hacker: executeIfApproved,
    public: executeIfApproved,
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .orderBy("prizeCategoryName", "asc")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const sponsorCompany = (res.locals.permissions as UserPermission).company;

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .orderBy("prizeCategoryName", "asc")
    .where("companyId", "==", sponsorCompany)
    .get()
    .then((documentsMatchSponsorCompany) => {
      firebaseApp
        .firestore()
        .collection("prizeCategories")
        .orderBy("prizeCategoryName", "asc")
        .where("approvalStatus", "==", "approved")
        .get()
        .then((documentsApproved) => {
          const combinedDocs = documentsMatchSponsorCompany.docs.concat(
            documentsApproved.docs.reduce((array, doc) => {
              if ((doc.data() as PMCategory).companyId !== sponsorCompany) {
                array.push(doc);
              }
              return array;
            }, [] as FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[])
          );
          send(combinedDocs)(req, res, next);
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
};

const executeIfApproved: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .orderBy("prizeCategoryName", "asc")
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

export default listCategories;
