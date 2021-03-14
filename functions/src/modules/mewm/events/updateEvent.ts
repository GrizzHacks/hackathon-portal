import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
    sponsor: { accepted: executeIfSponsorMatches },
    mentor: { accepted: executeIfApprovalStatusApproved },
    volunteer: { accepted: executeIfApprovalStatusApproved },
    hacker: { accepted: executeIfApprovalStatusApproved },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventName: { rules: ["string"] },
      eventDescription: { rules: ["string"] },
      virtual: { rules: ["boolean"] },
      location: { rules: ["string", "emptystring"]},
      joinLink: { rules: ["string", "emptystring"]},
      joinLinkToPresenters: { rules: ["number"]},
      joinLinkToAttendees: { rules: ["number"]},
      companyId: { rules: ["string", "emptystring"] },
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

  if(res.locals.parsedBody.approvalStatus === undefined){
    res.locals.parsedBody.approvalStatus = "inProgress"
  }

  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .update(res.locals.parsedBody as MEWMEventUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfApprovalStatusApproved: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  if (req.params.approvalStatus === "approved") {
    validate(req, res, next);
  } else {
    errorHandler(
      `Someone unauthorized tried viewing an event that is still undergoing approval.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).company;
  if (sponsorCompany === req.params.companyId || req.params.approvalStatus === "approved") {
    validate(req, res, next);
  } else {
    errorHandler(
      `Someone unauthorized tried viewing an event that is still undergoing approval.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default updateEvent;