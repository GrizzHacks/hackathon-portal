import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateMiniEvent: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: {accepted: validateOrganizer},
        sponsor: {accepted: executeIfSponsorMatches},
    })(req,res,next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {

    const validationRules: ValidatorObjectRules = {
        type: "object",
        rules: {
            eventName: { rules: ["string"], required: false},
            eventDescription: { rules: ["string"], required: false},
            location:  { rules: ["string"], required: false},
            virtual:  { rules: ["string"], required: false},
            joinLink: { rules: ["string"], required: false},
            joinLinkToPresenters: { rules: ["string"], required: false},
            joinLinkToAttendees: { rules: ["string"], required: false},
            companyId: { rules: ["string"], required: false},
            managers:{ rules: ["string"], required: false},
            speakers: { rules: ["string"], required: false},
        },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateSponsor: ExpressFunction = (req, res, next) => {

    const validationRules: ValidatorObjectRules = {
        type: "object",
        rules: {
            eventName: { rules: ["string"], required: false},
            eventDescription: { rules: ["string"], required: false},
            location:  { rules: ["string"], required: false},
            virtual:  { rules: ["string"], required: false},
            joinLink: { rules: ["string"], required: false},
            joinLinkToPresenters: { rules: ["string"], required: false},
            joinLinkToAttendees: { rules: ["string"], required: false},
            managers:{ rules: ["string"], required: false},
            speakers: { rules: ["string"], required: false},
        },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
  
    firebaseApp
      .firestore()
      .collection("mewm/events")
      .doc(req.params.companyId)
      .update(res.locals.parsedBody as MEWMEventUpdateRequest)
      .then(() => {
        res.status(200).send();
        next();
      })
      .catch(errorHandler);
  };

  const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
    const sponsorCompany = (res.locals.permissions as UserPermission).company;
    if (sponsorCompany === req.params.companyId) {
      validateSponsor(req, res, next);
    } else {
      errorHandler(
        `A sponsor from ${sponsorCompany} tried updating a mini event for ${req.params.companyId}.`,
        403,
        "Sorry, you do not have access to perform that operation."
      );
    }
  };
export default updateMiniEvent;
