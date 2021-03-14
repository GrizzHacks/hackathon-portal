import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
    sponsor: { accepted: validateSponsor }, // TO-DO: Need to filter for only sponsors where the benefit allows
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
      location: { rules: ["string"] },
      joinLink: { rules: ["string"] },
      joinLinkToPresenters: { rules: ["number"] },
      joinLinkToAttendees: { rules: ["number"] },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
          },
        ],
      },
      companyId: { rules: ["string"] },
      managers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
      speakers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
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
      location: { rules: ["string"] },
      joinLink: { rules: ["string"] },
      joinLinkToPresenters: { rules: ["number"] },
      joinLinkToAttendees: { rules: ["number"] },
      companyId: { rules: ["string"] },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
          },
        ],
      },
      managers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
      speakers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(
    req,
    res,
    next
  )(validationRules, executeIfSponsorMatches);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as MEWMEventCreateRequest;

  if (body.approvalStatus === undefined) {
    body.approvalStatus = "inProgress";
  }

  firebaseApp
    .firestore()
    .collection("events")
    .doc(body.eventId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).company;
  const body = res.locals.parsedBody as MEWMEventCreateRequest;

  if (sponsorCompany === body.companyId) {
    execute(req, res, next);
  } else {
    errorHandler(
      `Someone unauthorized tried viewing an event that is still undergoing approval.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default createEvent;
