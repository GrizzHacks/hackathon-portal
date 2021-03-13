import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
    sponsor: { accepted: validate }, // TO-DO: Need to filter for only sponsors where the benefit allows
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventId: { rules: ["string"], required: true },
      eventName: { rules: ["string"], required: true },
      eventDescription: { rules: ["string"], required: true },
      virtual: { rules: ["boolean"], required: true },
      location: { rules: ["string"]},
      joinLink: { rules: ["string"]},
      joinLinkToPresenters: { rules: ["string"]},
      joinLinkToAttendees: { rules: ["string"]},
      companyId: { rules: ["string"] },
      managers: { rules: [{
        type: "array",
        rules: ["string"],
      }]},
      speakers: { rules: [{
        type: "array",
        rules: ["string"],
      }]}
    }
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as METMMiniEventCreateRequest;

  firebaseApp
    .firestore()
    .collection("miniEvents")
    .doc(body.eventId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createEvent;