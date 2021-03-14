import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const deleteEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches }, // TO-DO: Need to filter only sponsor event managers allowed permission here
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .delete()
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const sponsorCompany = (res.locals.permissions as UserPermission).company;

  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .get()
    .then((doc) => {
      if (sponsorCompany === (doc.data() as MEWMEvent | undefined)?.companyId) {
        if (
          (doc.data() as MEWMEvent | undefined)?.approvalStatus !== "approved"
        ) {
          execute(req, res, next);
        } else {
          errorHandler(
            `A sponsor from ${sponsorCompany} tried deleting the approved event ${req.params.eventId}.`,
            400,
            "Sorry, this event has already been approved and published. Reach out to the organizing team if you still want to delete it."
          );
        }
      } else {
        errorHandler(
          `A sponsor from ${sponsorCompany} tried deleting the event ${req.params.eventId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
    })
    .catch(errorHandler);
};

export default deleteEvent;
