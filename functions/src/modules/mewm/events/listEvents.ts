import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listEvents: ExpressFunction = (req, res, next) => {
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
    .collection("events")
    .orderBy("eventName", "asc")
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
    .collection("events")
    .orderBy("eventName", "asc")
    .where("companyId", "==", sponsorCompany)
    .get()
    .then((documentsMatchSponsorCompany) => {
      firebaseApp
        .firestore()
        .collection("events")
        .orderBy("eventName", "asc")
        .where("approvalStatus", "==", "approved")
        .get()
        .then((documentsApproved) => {
          const combinedDocs = documentsMatchSponsorCompany.docs.concat(
            documentsApproved.docs.reduce((array, doc) => {
              if ((doc.data() as MEWMEvent).companyId !== sponsorCompany) {
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
    .collection("events")
    .orderBy("eventName", "asc")
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
  const events: MEWMEvent[] = [];
  for (const doc of docs) {
    events.push(doc.data() as MEWMEvent);
  }
  res.status(200).send(JSON.stringify({ events } as MEWMEventList));
  next();
};

export default listEvents;
