import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
    sponsor: { accepted: validateSponsor }, // TO-DO: Need to filter only sponsor event managers allowed permission here
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
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
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateSponsor: ExpressFunction = (req, res, next) => {
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
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("miniEvents")
    .doc(req.params.eventId)
    .update(res.locals.parsedBody as METMMiniEventUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default updateEvent;